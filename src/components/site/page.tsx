import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Footer } from "./sections-b";

export function SimplePage({ scene, title, children }: { scene: string; title: ReactNode; children: ReactNode }) {
  return (
    <>
      <nav className="fixed inset-x-0 top-6 z-50 px-4 md:px-8">
        <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
          <Link to="/" className="font-display text-2xl">ANMOL<span className="text-gold">.</span>SRIVASTAVA</Link>
          <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground">← BACK TO REEL</Link>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-40">
        <div className="eyebrow">{scene}</div>
        <h1 className="font-display mt-4 text-7xl md:text-9xl">{title}</h1>
        <div className="mt-12 space-y-6 text-muted-foreground">{children}</div>
      </main>
      <Footer />
    </>
  );
}
