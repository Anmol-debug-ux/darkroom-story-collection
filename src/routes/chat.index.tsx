import { createFileRoute } from '@tanstack/react-router';
import { ChatWorkspace } from '@/components/site/chat-workspace';
export const Route = createFileRoute('/chat/')({
  head: () => ({ meta: [
    { title: 'AI Chat — Anmol Srivastava' },
    { name: 'description', content: 'Talk with Anmol’s Gemini-powered AI assistant about creative work, automation and more.' },
    { property: 'og:title', content: 'AI Chat — Anmol Srivastava' },
    { property: 'og:description', content: 'A creative conversation with Anmol’s AI assistant.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: () => <ChatWorkspace key="new" />,
});