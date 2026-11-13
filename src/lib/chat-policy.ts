import { z } from 'zod';

export const chatInput = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().min(1).max(30000) })).min(1).max(200),
});
export const CHAT_MODEL = 'gemini-3.5-flash';
export type ChatEvent = { type: 'text'; text: string } | { type: 'done' } | { type: 'error'; message: string };
export function providerError(status: number): string {
  if (status === 429) return 'Gemini is busy or your account quota is reached. Please wait and try again.';
  if (status === 401 || status === 403) return 'Gemini access needs attention. The site owner should check the Gemini connection.';
  if (status === 400) return 'Gemini could not accept this conversation. Start a new conversation and try again.';
  return 'Gemini could not complete the answer. Your messages are still here; you can try again.';
}
export async function* readSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let end = buffer.indexOf('\n');
      while (end >= 0) {
        const line = buffer.slice(0, end).trimEnd();
        buffer = buffer.slice(end + 1);
        if (line.startsWith('data:')) yield line.slice(5).trimStart();
        end = buffer.indexOf('\n');
      }
      if (done) {
        if (buffer.startsWith('data:')) yield buffer.slice(5).trim();
        return;
      }
    }
  } finally { await reader.cancel().catch(() => undefined); reader.releaseLock(); }
}