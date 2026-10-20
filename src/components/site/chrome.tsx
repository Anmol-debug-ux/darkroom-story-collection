import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { scenes } from "@/lib/content";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem("as-loaded")) { setDone(true); onDone(); return; }
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.ceil(Math.random() * 7));
      setN(v);
      if (v >= 100) { clearInterval(id); setTimeout(() => { setDone(true); sessionStorage.setItem("as-loaded", "1"); onDone(); }, 350); }
    }, 45);
    return () => clearInterval(id);
  }, [onDone]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[200] flex" exit={{ pointerEvents: "none" }}>
          {[0, 1].map((i) => (
            <motion.div key={i} className="h-full w-1/2 bg-letterbox"
              exit={{ x: i ? "100%" : "-100%" }} transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }} />
          ))}
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-gold/30">
              <div className="absolute inset-4 rounded-full border border-gold/15" />
              <div className="absolute h-full w-px bg-gold/20" /><div className="absolute h-px w-full bg-gold/20" />
              <div className="absolute inset-0 rounded-full"
                style={{ background: `conic-gradient(color-mix(in oklab, var(--gold) 35%, transparent) ${n * 3.6}deg, transparent 0)` }} />
              <span className="font-display relative text-8xl text-gold">{String(n).padStart(3, "0")}</span>
            </div>
            <div className="eyebrow mt-8">Anmol Srivastava — Reel loading</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FilmChrome() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [scene, setScene] = useState(0);
  const [top, setTop] = useState(true);
  useEffect(() => {
    const els = scenes.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) setScene(Math.max(0, scenes.findIndex((s) => s.id === e.target.id))); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    els.forEach((el) => io.observe(el));
    const onS = () => setTop(window.scrollY < 600);
    window.addEventListener("scroll", onS, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onS); };
  }, []);
  return (
    <>
      <div aria-hidden className="grain" />
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 h-3 bg-letterbox md:h-5" />
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-3 bg-letterbox md:h-5" />
      <motion.div className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-gold-grad" style={{ scaleX: w }} />
      <div className="fixed bottom-8 left-6 z-40 hidden items-center gap-3 font-mono text-xs text-muted-foreground md:flex" aria-live="polite">
        <span className="h-2 w-2 rounded-full bg-rec animate-rec" /><span className="text-foreground">REC</span>
        <span className="text-gold">{String(scene + 1).padStart(2, "0")}</span>
        <span className="relative h-px w-16 bg-border"><motion.span className="absolute inset-0 origin-left bg-gold" animate={{ scaleX: (scene + 1) / scenes.length }} /></span>
        <span>{String(scenes.length).padStart(2, "0")}</span>
        <span className="uppercase tracking-widest">{scenes[scene].label}</span>
      </div>
      <AnimatePresence>
        {!top && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} data-cursor="TOP"
            className="glass fixed bottom-8 right-6 z-40 rounded-full px-4 py-3 font-mono text-xs" aria-label="Back to top">↑ TOP</motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem("as-cookies")) setTimeout(() => setShow(true), 2500); }, []);
  const close = (v: string) => { localStorage.setItem("as-cookies", v); setShow(false); };
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          className="glass fixed bottom-10 left-1/2 z-50 flex w-[min(92vw,560px)] -translate-x-1/2 flex-wrap items-center gap-4 rounded-2xl p-4 text-sm">
          <p className="flex-1 text-muted-foreground">This site uses only essential storage to remember your preferences. <Link to="/privacy" className="text-gold underline">Privacy</Link></p>
          <button onClick={() => close("no")} className="rounded-full px-4 py-2 text-muted-foreground hover:text-foreground">Decline</button>
          <button onClick={() => close("yes")} className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground">Accept</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
