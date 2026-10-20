import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Preloader, CookieBanner } from "@/components/site/chrome";
import { Hero, Marquee, About, Reel, Dailies, Nav } from "@/components/site/sections-a";
import { Craft, Workflow, Toolkit, Collaborate, Testimonials, Pricing, Faq, Credits, Footer } from "@/components/site/sections-b";

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
  const [, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return (
    <>
      <Preloader onDone={done} />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Reel />
        <Dailies />
        <Craft />
        <Workflow />
        <Toolkit />
        <Collaborate />
        <Testimonials />
        <Pricing />
        <Faq />
        <Credits />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
