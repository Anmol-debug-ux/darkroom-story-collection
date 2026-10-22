import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { categories, contact, films, marqueeItems, media, otherWork, pillars, projects } from "@/lib/content";
import { Counter, Magnetic, Reveal, SceneHead, TiltCard, WordReveal } from "./fx";
import { useSite } from "./overlays";
import { scrollToId } from "./smooth";

export function Nav() {
  const { openCmd, openBooking, theme, toggleTheme } = useSite();
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [["work", "The Reel"], ["services", "The Craft"], ["about", "Character"], ["workflow", "Process"], ["contact", "Credits"]];
  return (
    <nav className="fixed inset-x-0 top-3 z-50 px-4 md:top-6 md:px-8">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
        <button onClick={() => scrollToId("hero")} className="font-display text-2xl">ANMOL<span className="text-gold">.</span>SRIVASTAVA</button>
        <div className="hidden items-center gap-7 text-sm text-muted-foreground lg:flex">
          {links.map(([id, l]) => <button key={id} onClick={() => scrollToId(id)} className="transition-colors hover:text-foreground">{l}</button>)}
          <Link to="/blog" className="hover:text-foreground">Journal</Link>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openCmd} className="hidden rounded-full border px-3 py-1.5 font-mono text-xs text-muted-foreground md:block" aria-label="Open command menu">⌘K</button>
          <button onClick={toggleTheme} className="rounded-full border px-3 py-1.5 font-mono text-xs text-muted-foreground" aria-label="Toggle theme">{theme === "dark" ? "☾" : "☀"}</button>
          <button onClick={openBooking} className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground sm:block">Book a Call</button>
          <button className="lg:hidden px-2 text-xl" onClick={() => setOpen(!open)} aria-label="Menu">≡</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass mx-auto mt-2 max-w-7xl rounded-3xl bg-popover p-6 lg:hidden">
            {links.map(([id, l]) => <button key={id} onClick={() => { setOpen(false); scrollToId(id); }} className="font-display block py-2 text-4xl">{l}</button>)}
            <Link to="/blog" className="font-display block py-2 text-4xl">Journal</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const heroLines = [<>Creative direction</>, <>for the <span className="text-gold-grad">AI-native</span></>, <>era of brands.</>];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { openBooking } = useSite();
  return (
    <header ref={ref} id="hero" className="relative min-h-screen overflow-hidden pt-32">
      <div aria-hidden className="aura absolute inset-0" />
      <div aria-hidden className="absolute -left-32 top-20 h-[28rem] w-[28rem] rounded-full bg-electric/20 blur-3xl animate-blob" />
      <div aria-hidden className="absolute -right-20 bottom-10 h-[26rem] w-[26rem] rounded-full bg-violet/20 blur-3xl animate-blob" />
      <motion.div style={{ opacity: fade }} className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 md:px-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="timecode">SCENE 01 — COLD OPEN</motion.span>
          <h1 className="font-display mt-8 text-[17vw] animate-flicker sm:text-8xl lg:text-[6.5rem] xl:text-[7.5rem]">
            {heroLines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}>{l}</motion.span>
              </span>
            ))}
          </h1>
          <Reveal delay={0.7}>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">I'm Anmol Srivastava — an AI Creative Automation Specialist. I design, film, and automate the systems that let ambitious brands produce agency-grade work at a pace no agency can match.</p>
          </Reveal>
          <Reveal delay={0.85} className="mt-10 flex flex-wrap gap-4">
            <Magnetic><button onClick={openBooking} className="rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground shadow-gold">Let's Build Something Extraordinary</button></Magnetic>
            <Magnetic><button onClick={() => scrollToId("work")} data-cursor="VIEW" className="rounded-full border px-7 py-4 font-medium">View Selected Work</button></Magnetic>
          </Reveal>
          <div className="mt-14 flex gap-10 border-t pt-8">
            {[[27, "Services Offered"], [40, "Projects Delivered"], [12, "AI Tools Mastered"]].map(([n, l]) => (
              <div key={l}><b className="font-display text-5xl text-gold"><Counter to={n as number} suffix="+" /></b><div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>
        <motion.div style={{ y }} className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border">
            <motion.img src={media.portrait} alt="Portrait of Anmol Srivastava" className="grade h-full w-full object-cover"
              initial={{ scale: 1.25 }} animate={{ scale: 1.05 }} transition={{ duration: 14, ease: "linear" }} fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] text-foreground"><span className="h-2 w-2 rounded-full bg-rec animate-rec" />REC · 4K · 24FPS</div>
            {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-l border-b", "right-3 bottom-3 border-r border-b"].map((c) => (
              <span key={c} aria-hidden className={`absolute h-6 w-6 border-gold ${c}`} />
            ))}
          </div>
          <div className="glass absolute -bottom-6 -left-6 rounded-2xl px-5 py-4">
            <div className="text-sm font-medium">Creative Director / AI Systems</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-gold animate-rec" />Open to new work</div>
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">SCROLL ↓</div>
    </header>
  );
}

export function Marquee({ items = marqueeItems, reverse = false }: { items?: readonly string[]; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y py-6" aria-hidden>
      <div className="flex w-max animate-marquee" style={{ animationDirection: reverse ? "reverse" : "normal" }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((t, i) => <span key={i} className="font-display px-6 text-5xl md:text-6xl">{t}<span className="ml-12 text-gold">✦</span></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="lg:sticky lg:top-28 lg:h-fit">
          <TiltCard className="aspect-[4/5] rounded-[2rem] border">
            <img src={media.aboutPhoto} alt="Anmol Srivastava working portrait" loading="lazy" className="grade h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="timecode absolute bottom-4 left-4 z-20">B.TECH · MMMUT GORAKHPUR</span>
          </TiltCard>
        </Reveal>
        <div>
          <SceneHead scene="Scene 02 — Character Intro" title={<>The person<br />behind the <span className="text-gold-grad">pipeline.</span></>} />
          <div className="space-y-6 text-xl leading-relaxed">
            <p><WordReveal text="I sit at the intersection most people talk about and few actually build for: where creative craft meets automated systems. My work isn't “using AI tools” — it's engineering repeatable creative pipelines that produce cinematic, on-brand output at a volume traditional production can't touch." /></p>
            <p className="text-muted-foreground"><WordReveal text="I started as a designer and storyteller. Somewhere along the way I got obsessed with the systems underneath the work — how a studio's best output could be templated, automated, and scaled without losing its soul. That obsession became my practice." /></p>
            <p className="text-muted-foreground"><WordReveal text="Today I partner with founders and marketing teams who need more output, at higher quality, without a bigger team. Every engagement starts the same way: understand the brand's voice deeply enough that automation makes it stronger, not flatter." /></p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {pillars.map(([h, p], i) => (
              <Reveal key={h} delay={i * 0.06}>
                <TiltCard className="glass h-full rounded-2xl p-6">
                  <h4 className="eyebrow">{h}</h4>
                  <p className="mt-3 text-muted-foreground">{p}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reel() {
  const { openProject } = useSite();
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => projects.filter((p) => (cat === "All" || p.category === cat) && p.title.toLowerCase().includes(q.toLowerCase())), [cat, q]);
  const others = otherWork.filter((o) => (cat === "All" || o.category === cat) && o.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <section id="work" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SceneHead scene="Scene 03 — The Reel" title={<>Recent output across<br />the <span className="text-gold-grad">pipeline.</span></>}
          sub="A sample of AI-driven design, character work, and content produced end-to-end — from concept through final render." />
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`relative rounded-full px-4 py-2 text-sm transition-colors ${cat === c ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-primary" />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the reel…" aria-label="Search projects"
            className="glass rounded-full px-5 py-2.5 text-sm outline-none focus:border-gold md:w-64" />
        </div>
        <motion.div layout className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div layout key={p.slug} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`${p.size === "wide" ? "lg:col-span-2" : ""} ${p.size === "tall" ? "row-span-2" : ""}`}>
                <TiltCard cursor={p.video ? "PLAY" : "VIEW"} className="h-full rounded-2xl border">
                  <button onClick={() => openProject(p)} className="block h-full w-full text-left" aria-label={`Open ${p.title}`}>
                    <motion.div layoutId={`img-${p.slug}`} className="h-full w-full overflow-hidden">
                      <img src={p.image} alt={p.alt} loading="lazy" className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:[filter:var(--grade)_brightness(1.1)]" />
                    </motion.div>
                    <span className="timecode absolute left-4 top-4 z-20">{p.timecode}</span>
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background/95 to-transparent p-5 pt-16">
                      <div className="eyebrow text-[10px]">{p.category}</div>
                      <h3 className="font-display mt-1 text-3xl">{p.title}</h3>
                    </div>
                  </button>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {!list.length && !others.length && <p className="py-16 text-center text-muted-foreground">Nothing in this reel yet.</p>}
        {others.length > 0 && (
          <div className="mt-20">
            <div className="eyebrow mb-6">Other productions</div>
            <div className="divide-y border-y">
              {others.map((o) => {
                const inner = (
                  <div className="group flex items-center justify-between gap-6 py-6">
                    <h3 className="font-display text-4xl transition-transform duration-500 group-hover:translate-x-3 group-hover:text-gold md:text-5xl">{o.title}</h3>
                    <div className="text-right"><div className="eyebrow text-[10px]">{o.kind}</div><p className="mt-1 hidden text-sm text-muted-foreground md:block">{o.note}</p></div>
                  </div>
                );
                return o.href ? <a key={o.title} href={o.href} target="_blank" rel="noreferrer" data-cursor="VIEW" className="block">{inner}</a> : <div key={o.title}>{inner}</div>;
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* Pinned horizontal-scroll showreel of the films */
export function Dailies() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
  const [light, setLight] = useState<string | null>(null);
  return (
    <section ref={ref} className="relative h-[260vh]" aria-label="Dailies — video work">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-7xl px-6 md:px-10">
          <div className="eyebrow">Scene 03B — Dailies</div>
          <h2 className="font-display mt-4 text-6xl md:text-8xl">A few things <span className="text-gold-grad">in motion.</span></h2>
          <p className="mt-4 max-w-xl text-muted-foreground">Stills only tell half the story. Here's a small sample of AI-produced video work — avatar delivery, UGC-style ads, and animation.</p>
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-6 md:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]" data-cursor="DRAG">
          {films.map((f, i) => (
            <button key={f.title} onClick={() => setLight(f.src)} data-cursor="PLAY"
              className="group relative aspect-video w-[80vw] shrink-0 overflow-hidden rounded-2xl border md:w-[46vw]">
              <video src={f.src} poster={f.poster} muted loop playsInline preload="none"
                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})} onMouseLeave={(e) => { e.currentTarget.pause(); }}
                className="grade h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="timecode absolute left-4 top-4">TAKE {String(i + 1).padStart(2, "0")}</span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-6 pt-20 text-left">
                <div className="eyebrow text-[10px]">{f.category}</div>
                <h3 className="font-display mt-1 text-4xl">{f.title}</h3>
              </div>
              <span className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">▶</span>
            </button>
          ))}
          <div className="flex w-[40vw] shrink-0 items-center"><a href={contact.youtube} target="_blank" rel="noreferrer" className="font-display text-5xl text-muted-foreground hover:text-gold">More on YouTube →</a></div>
        </motion.div>
      </div>
      <AnimatePresence>
        {light && (
          <motion.div className="fixed inset-0 z-[150] flex items-center justify-center bg-background/90 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLight(null)} role="dialog" aria-label="Video player">
            <motion.video initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={light} controls autoPlay playsInline className="max-h-[85vh] w-full max-w-5xl rounded-2xl" onClick={(e) => e.stopPropagation()} />
            <button className="glass absolute right-6 top-8 rounded-full px-5 py-3 font-mono text-xs" onClick={() => setLight(null)}>ESC ×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
