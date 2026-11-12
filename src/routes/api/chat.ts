import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { chatInput, CHAT_MODEL, providerError, readSSE } from '@/lib/chat-policy';
import { profile, selectedWork, skills, records } from '@/lib/portfolio';

const chunkSchema = z.object({
  error: z.object({ code: z.number().optional() }).optional(),
  promptFeedback: z.object({ blockReason: z.string().optional() }).optional(),
  candidates: z.array(z.object({ content: z.object({ parts: z.array(z.object({ text: z.string().optional(), thought: z.boolean().optional() })).optional() }).optional(), finishReason: z.string().optional() })).optional(),
});
export const Route = createFileRoute('/api/chat')({ server: { handlers: {
  POST: async ({ request }) => {
    // The chatbot is intentionally public, but only same-origin app requests are accepted.
    const origin = request.headers.get('origin');
    if (origin !== new URL(request.url).origin) return Response.json({ message: 'Open the chatbot on this website.' }, { status: 403 });
    let body: unknown;
    try { body = await request.json(); } catch { return Response.json({ message: 'Invalid message.' }, { status: 400 }); }
    const parsed = chatInput.safeParse(body);
    if (!parsed.success) return Response.json({ message: 'This conversation is too long. Please start a new conversation.' }, { status: 400 });
    const key = process.env['UDC_GEMINI_API_API_KEY'];
    const gatewayKey = process.env['LOVABLE_API_KEY'];
    if (!key || !gatewayKey) return Response.json({ message: 'The Gemini connection is not ready.' }, { status: 503 });
    const upstreamAbort = new AbortController();
    request.signal.addEventListener('abort', () => upstreamAbort.abort(), { once: true });
    let upstream: Response;
    try {
      upstream = await fetch(`https://connector-gateway.lovable.dev/udc_gemini_api/v1beta/models/${CHAT_MODEL}:streamGenerateContent?alt=sse`, {
        method: 'POST', signal: upstreamAbort.signal,
        headers: { Authorization: `Bearer ${gatewayKey}`, 'X-Connection-Api-Key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: `You are Anmol's helpful AI assistant, not Anmol himself. Answer general questions, coding and creative requests clearly and accurately. Be concise unless detail is requested. Match the user's language. Ask for clarification when needed. Admit uncertainty; never invent facts or claim live web access. For questions about Anmol, use only this verified public portfolio: ${JSON.stringify({ profile, selectedWork, skills, records })}. Never invent achievements, pricing or availability. Never provide a phone number. Use Markdown for readable responses.` }] },
          contents: parsed.data.messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
        }),
      });
    } catch { return Response.json({ message: 'Could not reach Gemini. Your message is still here; try again when connected.' }, { status: 502 }); }
    if (!upstream.ok) {
      // Provider bodies may contain credential-bearing diagnostics; do not log or expose them.
      await upstream.body?.cancel();
      console.error('Gemini request failed', { status: upstream.status });
      return Response.json({ message: providerError(upstream.status), status: upstream.status }, { status: upstream.status });
    }
    const upstreamBody = upstream.body;
    if (!upstreamBody) return Response.json({ message: providerError(502) }, { status: 502 });
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const emit = (event: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        let hasText = false;
        try {
          for await (const line of readSSE(upstreamBody)) {
            if (line === '[DONE]') continue;
            const chunk = chunkSchema.parse(JSON.parse(line));
            if (chunk.error) throw new Error(providerError(chunk.error.code ?? 502));
            if (chunk.promptFeedback?.blockReason) throw new Error('Gemini declined this request. Please ask a different question.');
            for (const candidate of chunk.candidates ?? []) {
              for (const part of candidate.content?.parts ?? []) {
                if (part.text && !part.thought) { hasText = true; emit({ type: 'text', text: part.text }); }
              }
              if (candidate.finishReason === 'SAFETY') throw new Error('Gemini declined to complete this request.');
              if (candidate.finishReason === 'MAX_TOKENS') emit({ type: 'text', text: '\n\n*Answer reached Gemini’s response limit. Ask me to continue.*' });
            }
          }
          if (!hasText) emit({ type: 'error', message: 'Gemini returned no answer. Try rephrasing your question.' });
          else emit({ type: 'done' });
        } catch { if (!upstreamAbort.signal.aborted) emit({ type: 'error', message: 'The answer was interrupted or declined. Any received text is preserved; you can try again.' }); }
        finally { controller.close(); }
      },
      cancel() { upstreamAbort.abort(); },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  },
} } });