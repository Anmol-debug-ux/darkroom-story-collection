import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, useInView, animate } from "framer-motion";

/* Custom REC cursor + crosshair that morphs via [data-cursor] */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement)?.closest?.("[data-cursor],a,button") as HTMLElement | null;
      setLabel(t ? t.dataset["cursor"] ?? "" : null);
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  const big = label !== null && label !== "";
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-gold/70 font-mono text-[10px] tracking-[0.2em] text-gold"
        animate={{ width: big ? 84 : label === "" ? 44 : 30, height: big ? 84 : label === "" ? 44 : 30, backgroundColor: big ? "color-mix(in oklab, var(--background) 70%, transparent)" : "transparent" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {big ? label : (
          <>
            <span className="absolute h-px w-3 bg-gold/70" />
            <span className="absolute h-3 w-px bg-gold/70" />
            <span className="absolute -right-3 -top-2 h-1.5 w-1.5 rounded-full bg-rec animate-rec" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* Magnetic wrapper */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* 3D tilt + mouse spotlight card */
export function TiltCard({ children, className = "", cursor }: { children: ReactNode; className?: string; cursor?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 15 });
  const ry = useSpring(0, { stiffness: 150, damping: 15 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      data-cursor={cursor}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ref.current!.style.setProperty("--mx", `${px * 100}%`);
        ref.current!.style.setProperty("--my", `${py * 100}%`);
        if (!reduce) { ry.set((px - 0.5) * 10); rx.set((0.5 - py) * 10); }
      }}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(400px circle at var(--mx) var(--my), color-mix(in oklab, var(--gold) 16%, transparent), transparent 60%)" }}
      />
      {children}
    </motion.div>
  );
}

/* Subtitle-style word reveal */
export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.span className={className} initial="h" whileInView="s" viewport={{ once: true, margin: "-10%" }}
      transition={{ staggerChildren: 0.035 }}>
      {words.map((w, i) => (
        <motion.span key={i} className="inline-block"
          variants={{ h: { opacity: 0.12, y: 6, filter: "blur(4px)" }, s: { opacity: 1, y: 0, filter: "blur(0px)" } }}
          transition={{ duration: 0.5 }}>
          {w}&nbsp;
        </motion.span>
      ))}
    </motion.span>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, { duration: 1.8, ease: "easeOut", onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; } });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export function SceneHead({ scene, title, sub }: { scene: string; title: ReactNode; sub?: string }) {
  return (
    <div className="mb-14 max-w-3xl">
      <Reveal><div className="eyebrow flex items-center gap-3"><span className="h-px w-8 bg-gold" />{scene}</div></Reveal>
      <Reveal delay={0.05}><h2 className="font-display mt-5 text-6xl md:text-8xl">{title}</h2></Reveal>
      {sub && <p className="mt-6 max-w-xl text-lg text-muted-foreground"><WordReveal text={sub} /></p>}
    </div>
  );
}
