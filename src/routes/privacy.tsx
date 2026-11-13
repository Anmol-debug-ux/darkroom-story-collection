import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/page";
import { contact } from "@/lib/content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Anmol Srivastava" },
      { name: "description", content: "How this site handles your information." },
      { property: "og:title", content: "Privacy Policy — Anmol Srivastava" },
      { property: "og:description", content: "How this site handles your information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SimplePage scene="Legal" title="Privacy Policy">
      <p>This site stores your animation preference in your browser.</p>
      <p>AI chat conversations stay only in the current page session and are cleared when you refresh. Your messages are sent to Google Gemini to generate answers and may be processed under Google's policies. Do not send sensitive personal information.</p>
      <p>When you send an inquiry, the details you provide are used only to reply to you and are never sold or shared.</p>
      <p>Questions? Email <a className="text-gold" href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
    </SimplePage>
  ),
});
