import { describe, expect, it } from 'vitest';
import { readSSE, chatInput } from './chat-policy';
describe('chat transport', () => {
  it('preserves all messages in separate conversation input', () => {
    const messages = [{ role: 'user', text: 'Remember apples' }, { role: 'assistant', text: 'Apples' }, { role: 'user', text: 'What fruit?' }];
    expect(chatInput.parse({ messages }).messages).toEqual(messages);
  });
  it('reads split streamed events including Unicode', async () => {
    const bytes = new TextEncoder().encode('data: {"text":"नमस्ते"}\r\n\r\ndata: {"type":"done"}\n\n');
    const stream = new ReadableStream<Uint8Array>({ start(c) { for (let i = 0; i < bytes.length; i += 3) c.enqueue(bytes.slice(i, i + 3)); c.close(); } });
    const events = []; for await (const e of readSSE(stream)) events.push(JSON.parse(e));
    expect(events).toEqual([{ text: 'नमस्ते' }, { type: 'done' }]);
  });
});