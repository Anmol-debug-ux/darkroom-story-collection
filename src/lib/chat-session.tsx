import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UIMessage } from 'ai';

export type Thread = { id: string; title: string; messages: UIMessage[] };
const ChatContext = createContext<{ threads: Thread[]; update: (thread: Thread) => void; remove: (id: string) => void } | null>(null);
export function ChatSession({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  return <ChatContext.Provider value={{ threads, update: thread => setThreads(prev => prev.some(t => t.id === thread.id) ? prev.map(t => t.id === thread.id ? thread : t) : [...prev, thread]), remove: id => setThreads(prev => prev.filter(t => t.id !== id)) }}>{children}</ChatContext.Provider>;
}
export function useChatSession() {
  const value = useContext(ChatContext);
  if (!value) throw new Error('Chat session is unavailable');
  return value;
}