import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — Anmol Srivastava" },
      { name: "description", content: "Terms of use for this portfolio." },
      { property: "og:title", content: "Terms — Anmol Srivastava" },
      { property: "og:description", content: "Terms of use for this portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SimplePage scene="Legal" title="Terms">
      <p>All work shown is © Anmol Srivastava unless stated otherwise and may not be reused without permission.</p>
      <p>Project scope, pricing and timelines are agreed individually in writing before any engagement begins.</p>
    </SimplePage>
  ),
});
