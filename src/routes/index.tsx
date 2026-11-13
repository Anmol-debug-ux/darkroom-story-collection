import { createFileRoute } from "@tanstack/react-router";
import { NightPortfolio } from "@/components/site/night-portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anmol Srivastava — AI Artist & Creative Automation Specialist" },
      { name: "description", content: "AI art, design, projects and creative automation by Anmol Srivastava, Gorakhpur." },
      { property: "og:title", content: "Anmol Srivastava — AI Creative Automation Specialist" },
      { property: "og:description", content: "Creative direction, AI production, and automation systems for brands that want to move faster without looking like it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <NightPortfolio />;
}
