import { createFileRoute } from '@tanstack/react-router';
import { ChatWorkspace } from '@/components/site/chat-workspace';
export const Route = createFileRoute('/chat/$threadId')({
  validateSearch: (search: Record<string, unknown>): { send?: boolean } => search['send'] === true || search['send'] === 'true' ? { send: true } : {},
  head: () => ({ meta: [
    { title: 'Conversation — Anmol’s AI Assistant' },
    { name: 'description', content: 'A temporary conversation with Anmol’s Gemini-powered AI assistant.' },
    { property: 'og:title', content: 'Conversation — Anmol’s AI Assistant' },
    { property: 'og:description', content: 'Creative questions and answers with Gemini.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: ThreadPage,
});
function ThreadPage() { const { threadId } = Route.useParams(); return <ChatWorkspace key={threadId} threadId={threadId} />; }