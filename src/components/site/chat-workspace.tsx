import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import type { ChatStatus, UIMessage } from 'ai';
import { ArrowLeft, Plus, Trash2, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse, MessageActions, MessageAction } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from '@/components/ai-elements/prompt-input';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { useChatSession } from '@/lib/chat-session';
import { readSSE, type ChatEvent } from '@/lib/chat-policy';

const textOf = (message: UIMessage) => message.parts.filter(p => p.type === 'text').map(p => p.text).join('');
export function ChatWorkspace({ threadId }: { threadId?: string }) {
  const { threads, update, remove } = useChatSession();
  const navigate = useNavigate();
  const thread = threads.find(t => t.id === threadId);
  const [messages, setMessages] = useState<UIMessage[]>(thread?.messages ?? []);
  const [status, setStatus] = useState<ChatStatus>('ready');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const abort = useRef<AbortController | null>(null);
  const input = useRef<HTMLTextAreaElement | null>(null);
  const busy = status === 'submitted' || status === 'streaming';
  useEffect(() => { input.current?.focus(); return () => abort.current?.abort(); }, []);
  function commit(next: UIMessage[]) {
    setMessages(next);
    if (threadId) update({ id: threadId, title: textOf(next.find(m => m.role === 'user') ?? { id: '', role: 'user', parts: [] }).slice(0, 48) || 'New conversation', messages: next });
  }
  async function answer(history: UIMessage[]) {
    if (!threadId || busy) return;
    setError(''); setStatus('submitted'); input.current?.focus();
    const controller = new AbortController(); abort.current = controller;
    const reply: UIMessage = { id: crypto.randomUUID(), role: 'assistant', parts: [] };
    let next = history;
    let received = false;
    try {
      const response = await fetch('/api/chat', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.map(m => ({ role: m.role, text: textOf(m) })).filter(m => m.text) }) });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(typeof data.message === 'string' ? data.message : 'Gemini could not answer. Try again.');
      }
      if (!response.body) throw new Error('Gemini returned no answer.');
      let completed = false;
      for await (const line of readSSE(response.body)) {
        const event: ChatEvent = JSON.parse(line);
        if (event.type === 'error') throw new Error(event.message);
        if (event.type === 'done') { completed = true; continue; }
        if (event.type === 'text') {
          received = true; setStatus('streaming');
          reply.parts = [{ type: 'text', text: textOf(reply) + event.text }];
          next = [...history, { ...reply }]; commit(next);
        }
      }
      if (!completed) throw new Error('The answer was interrupted. You can try again.');
      setStatus('ready');
    } catch (err) {
      if (controller.signal.aborted) { setStatus('ready'); }
      else { setError(err instanceof Error ? err.message : 'Connection interrupted. Try again.'); setStatus('error'); }
      if (!received) commit(history);
    } finally { abort.current = null; input.current?.focus(); }
  }
  function send(text: string) {
    if (!text.trim() || busy) return;
    const user: UIMessage = { id: crypto.randomUUID(), role: 'user', parts: [{ type: 'text', text: text.trim() }] };
    setDraft('');
    if (!threadId) {
      const id = crypto.randomUUID();
      update({ id, title: text.trim().slice(0, 48), messages: [user] });
      void navigate({ to: '/chat/$threadId', params: { threadId: id }, search: { send: true } });
      return;
    }
    const next = [...messages, user]; commit(next); void answer(next);
  }
  function retry() {
    let lastUser = -1;
    messages.forEach((m, index) => { if (m.role === 'user') lastUser = index; });
    if (lastUser < 0) return;
    const history = messages.slice(0, lastUser + 1); commit(history); void answer(history);
  }
  // Auto-send only a newly created thread, never a reload or an existing URL.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!threadId || thread?.messages.length !== 1 || autoStarted.current) return;
    // Defer until route/history synchronization and StrictMode's cleanup finish.
    const timer = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get('send') !== 'true') return;
      autoStarted.current = true; void answer(thread.messages);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [threadId, thread?.messages, answer]);
  return <div className="chat-page">
    <aside className="chat-sidebar">
      <Link to="/" className="chat-home"><ArrowLeft size={16} /> Portfolio</Link>
      <div className="chat-sidebar-heading"><span className="portfolio-label">CONVERSATIONS</span><Button variant="ghost" size="icon" title="New conversation" aria-label="New conversation" onClick={() => { abort.current?.abort(); void navigate({ to: '/chat' }); }}><Plus /></Button></div>
      <nav aria-label="Conversations">{threads.map(t => <div className="chat-thread" key={t.id}><Button asChild variant={t.id === threadId ? 'secondary' : 'ghost'} className="chat-thread-link"><Link to="/chat/$threadId" params={{ threadId: t.id }} search={{}}>{t.title}</Link></Button><Button size="icon-sm" variant="ghost" title="Delete conversation" aria-label={`Delete ${t.title}`} onClick={() => { remove(t.id); if (t.id === threadId) { abort.current?.abort(); void navigate({ to: '/chat' }); } }}><Trash2 /></Button></div>)}</nav>
      <span className="chat-session-label">TEMPORARY SESSION</span>
    </aside>
    <main className="chat-main">
      <header className="chat-header"><div className="chat-identity" aria-label="Anmol AI assistant">as<span>.</span></div><div><h1>Anmol’s AI assistant</h1><span>GEMINI / FLASH</span></div><Button asChild variant="ghost" size="icon" title="Return to portfolio"><Link to="/" aria-label="Return to portfolio"><ArrowLeft /></Link></Button></header>
      <Conversation><ConversationContent className="chat-transcript">
        {!messages.length && <div className="chat-empty"><div className="chat-identity large">as<span>.</span></div><h2>What’s on your mind?</h2><div className="chat-suggestions">{['Tell me about Anmol’s work', 'Help me automate a workflow', 'Brainstorm a creative project'].map(q => <Button key={q} variant="outline" onClick={() => send(q)}>{q}</Button>)}</div></div>}
        {messages.map(m => <Message key={m.id} from={m.role}><MessageContent>{m.parts.map((part, i) => part.type === 'text' ? <MessageResponse key={i}>{part.text}</MessageResponse> : null)}</MessageContent>{m.role === 'assistant' && !busy && <MessageActions><MessageAction tooltip="Copy answer" onClick={() => void navigator.clipboard.writeText(textOf(m)).catch(() => setError('Copy unavailable in this browser.'))}><Copy /></MessageAction></MessageActions>}</Message>)}
        {status === 'submitted' && <Shimmer>Thinking…</Shimmer>}
        {error && <div role="alert" className="chat-error"><p>{error}</p><Button variant="outline" size="sm" onClick={retry}><RotateCcw /> Try again</Button></div>}
      </ConversationContent><ConversationScrollButton aria-label="Scroll to latest message" /></Conversation>
      <div className="chat-composer"><PromptInput maxFiles={0} onSubmit={({ text }) => send(text)}><PromptInputTextarea ref={input} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (busy && e.key === 'Enter' && !e.shiftKey) e.preventDefault(); }} placeholder="Ask anything…" aria-label="Your message" maxLength={30000} className="min-h-20 max-h-48" /><PromptInputFooter className="justify-end"><PromptInputSubmit status={status} disabled={!busy && !draft.trim()} onStop={() => abort.current?.abort()} /></PromptInputFooter></PromptInput><p className="chat-disclaimer">AI can make mistakes. Check important information.</p></div>
    </main>
  </div>;
}