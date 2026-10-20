import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/page";

const cats = ["AI", "Automation", "Prompt Engineering", "Content", "Case Studies"];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Journal — Anmol Srivastava" },
      { name: "description", content: "Notes on AI, automation, prompt engineering, content and case studies." },
      { property: "og:title", content: "Journal — Anmol Srivastava" },
      { property: "og:description", content: "Notes on AI, automation, prompt engineering, content and case studies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <SimplePage scene="Behind the Scenes" title={<>The <span className="text-gold-grad">Journal.</span></>}>
      <div className="flex flex-wrap gap-2">{cats.map((c) => <span key={c} className="rounded-full border px-4 py-2 text-sm">{c}</span>)}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cats.map((c) => (
          <article key={c} className="glass rounded-2xl p-6">
            <div className="eyebrow text-[10px]">{c}</div>
            <h2 className="font-display mt-3 text-3xl text-foreground">[Placeholder] First {c} post</h2>
            <p className="mt-2 text-sm">Coming soon.</p>
          </article>
        ))}
      </div>
    </SimplePage>
  );
}
