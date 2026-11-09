import { createFileRoute } from "@tanstack/react-router";
import { AgentPortfolio } from "@/components/site/agent-portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anmol Srivastava — AI Artist & Creative Automation Specialist" },
      { name: "description", content: "Cinematic AI design, films, UGC ads and creative automation systems by Anmol Srivastava." },
      { property: "og:title", content: "Anmol Srivastava — AI Creative Automation Specialist" },
      { property: "og:description", content: "Creative direction, AI production, and automation systems for brands that want to move faster without looking like it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AgentPortfolio />;
}
