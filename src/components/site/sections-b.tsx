import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { collabSteps, contact, faqs, services, stages, tools, type ServiceCat } from "@/lib/content";
import { Magnetic, Reveal, SceneHead, TiltCard } from "./fx";
import { useSite } from "./overlays";
import { Marquee } from "./sections-a";

const tabs: [ServiceCat | "all", string][] = [["all", "All"], ["creative", "Creative & Design"], ["ai", "AI Production"], ["automation", "Automation & Growth"]];

export function Craft() {
  const [cat, setCat] = useState<ServiceCat | "all">("all");
  const list = services.filter((s) => cat === "all" || s.cat === cat);
  return (
    <section id="services" className="relative py-32">
      <div aria-hidden className="aura absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SceneHead scene="Scene 04 — The Craft" title={<>One partner, every<br />discipline your <span className="text-gold-grad">content stack</span> needs.</>}
          sub="From first concept to automated delivery pipeline — grouped by what you're actually trying to solve." />
        <div className="mb-10 flex flex-wrap gap-2" role="tablist">
          {tabs.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={cat === k} onClick={() => setCat(k)} className={`relative rounded-full px-4 py-2 text-sm ${cat === k ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {cat === k && <motion.span layoutId="svc-pill" className="absolute inset-0 rounded-full bg-primary" />}<span className="relative">{l}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((s) => {
              const n = services.indexOf(s) + 1;
              return (
                <motion.div layout key={s.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <TiltCard className="glass h-full rounded-2xl p-6">
                    <div className="font-mono text-xs text-gold">{String(n).padStart(2, "0")}</div>
                    <h3 className="font-display mt-6 text-3xl">{s.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* 9-stage production timeline: scroll drives it, scrubber can be dragged */
export function Workflow() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const dragging = useRef(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!dragging.current) setI(Math.min(8, Math.max(0, Math.floor(v * 9))));
  });
  const scrub = (n: number) => {
    setI(n);
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (n + 0.5)) / 9;
    window.scrollTo({ top });
  };
  return (
    <section id="workflow" ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="eyebrow">Scene 04B — Production Stages</div>
          <h2 className="font-display mt-4 text-6xl md:text-8xl">One system, <span className="text-gold-grad">start to finish.</span></h2>
          <p className="mt-4 max-w-xl text-muted-foreground">Every project moves through the same nine stages — the order is what keeps quality consistent at speed.</p>
          <div className="mt-14 grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 20, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -20, filter: "blur(6px)" }} transition={{ duration: 0.4 }}>
                <div className="font-display text-[9rem] leading-none text-gold/20">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display -mt-10 text-6xl">{stages[i]![0]}</h3>
                <p className="mt-4 max-w-md text-lg text-muted-foreground">{stages[i]![1]}</p>
              </motion.div>
            </AnimatePresence>
            <div className="glass rounded-2xl p-6">
              <div className="flex justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
                <span>PRODUCTION TIMELINE</span><span className="text-gold">{String(i + 1).padStart(2, "0")} / 09 — {stages[i]![0]}</span>
              </div>
              <div className="relative mt-8 h-16" data-cursor="DRAG">
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                <motion.div className="absolute left-0 top-1/2 h-px bg-gold-grad" animate={{ width: `${(i / 8) * 100}%` }} />
                {stages.map((s, n) => (
                  <button key={s[0]} onClick={() => scrub(n)} aria-label={`Stage ${n + 1}: ${s[0]}`}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(n / 8) * 100}%` }}>
                    <span className={`block h-3 w-3 rounded-full border transition-all ${n <= i ? "border-gold bg-gold" : "bg-background"} ${n === i ? "scale-150 shadow-gold" : ""}`} />
                  </button>
                ))}
                <input type="range" min={0} max={8} value={i} aria-label="Scrub production timeline"
                  onPointerDown={() => (dragging.current = true)} onPointerUp={() => { dragging.current = false; scrub(i); }}
                  onChange={(e) => setI(Number(e.target.value))}
                  className="absolute inset-0 w-full cursor-pointer opacity-0" />
              </div>
              <div className="mt-2 grid grid-cols-9 text-center font-mono text-[9px] text-muted-foreground">
                {stages.map((s, n) => <span key={s[0]} className={n === i ? "text-gold" : ""}>{String(n + 1).padStart(2, "0")}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Toolkit() {
  return (
    <section id="tools" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SceneHead scene="Scene 05 — The Toolkit" title={<>Equipment <span className="text-gold-grad">&amp; gear.</span></>} sub="The production stack behind every frame — listed the way a film credits its gear." />
        <div className="relative mx-auto h-[28rem] max-w-2xl overflow-hidden [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]">
          <div className="animate-credits">
            {[0, 1].map((k) => (
              <div key={k} className="space-y-5 py-4">
                {tools.map(([t, r]) => (
                  <div key={t + k} className="grid grid-cols-2 gap-6">
                    <span className="text-right font-mono text-xs uppercase tracking-widest text-muted-foreground">{r}</span>
                    <span className="font-display text-3xl">{t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-16"><Marquee items={tools.map((t) => t[0])} reverse /></div>
    </section>
  );
}

export function Collaborate() {
  const { openBooking } = useSite();
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SceneHead scene="How We'll Work Together" title={<>From first call to <span className="text-gold-grad">ongoing support.</span></>} />
        <div className="grid gap-4 md:grid-cols-7">
          {collabSteps.map(([h, p], n) => (
            <Reveal key={h} delay={n * 0.05}>
              <div className="h-full border-t border-gold/40 pt-5">
                <div className="font-mono text-[10px] tracking-widest text-gold">STEP {String(n + 1).padStart(2, "0")}</div>
                <h4 className="font-display mt-3 text-2xl">{h}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 flex items-center gap-6">
          <span className="eyebrow">Ready when you are</span>
          <Magnetic><button onClick={openBooking} className="rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground shadow-gold">Book a Discovery Call</button></Magnetic>
        </div>
      </div>
    </section>
  );
}

const placeholderQuotes = [
  ["Client testimonial goes here — add real feedback from a recent engagement.", "Client name", "Role, Company"],
  ["Second testimonial placeholder. Replace with a genuine quote and permission to publish.", "Client name", "Role, Company"],
  ["Third testimonial placeholder — more will be added as projects wrap.", "Client name", "Role, Company"],
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((v) => (v + 1) % placeholderQuotes.length), 6000); return () => clearInterval(id); }, []);
  const q = placeholderQuotes[i]!;
  return (
    <section className="py-32">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <div className="eyebrow">Testimonials · <span className="text-muted-foreground">[Placeholder]</span></div>
        <div className="relative mt-10 min-h-56">
          <AnimatePresence mode="wait">
            <motion.blockquote key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <p className="font-display text-4xl md:text-6xl">“{q[0]}”</p>
              <footer className="mt-8 text-sm text-muted-foreground"><b className="text-foreground">{q[1]}</b> — {q[2]}</footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {placeholderQuotes.map((_, n) => <button key={n} onClick={() => setI(n)} aria-label={`Testimonial ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-gold" : "w-3 bg-border"}`} />)}
        </div>
      </div>
    </section>
  );
}

const packages = [
  ["Short", "Single deliverable", ["One focused asset or video", "Two review rounds", "Delivered in your format"]],
  ["Feature", "Campaign or series", ["Multi-asset campaign", "Prompt system included", "Priority checkpoints"]],
  ["Franchise", "Ongoing system", ["Automated content pipeline", "Monthly production", "Ongoing support"]],
] as const;

export function Pricing() {
  const { openBooking } = useSite();
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SceneHead scene="Packages" title={<>Pick your <span className="text-gold-grad">format.</span></>} sub="Pricing is scoped per project after a discovery call." />
        <div className="grid gap-4 md:grid-cols-3">
          {packages.map(([n, s, f], k) => (
            <TiltCard key={n} className={`glass rounded-2xl p-8 ${k === 1 ? "border-gold/50" : ""}`}>
              <div className="eyebrow">{s}</div>
              <h3 className="font-display mt-4 text-6xl">{n}</h3>
              <div className="mt-2 font-mono text-sm text-muted-foreground">[Price on request]</div>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">{f.map((x) => <li key={x}>— {x}</li>)}</ul>
              <button onClick={openBooking} className={`mt-8 w-full rounded-full py-3 font-medium ${k === 1 ? "bg-primary text-primary-foreground" : "border"}`}>Discuss {n}</button>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SceneHead scene="FAQ" title={<>Before you <span className="text-gold-grad">roll camera.</span></>} />
        <div className="divide-y border-y">
          {faqs.map(([q, a], n) => (
            <div key={q}>
              <button onClick={() => setOpen(open === n ? null : n)} aria-expanded={open === n} className="flex w-full items-center justify-between py-6 text-left">
                <span className="text-lg font-medium">{q}</span>
                <motion.span animate={{ rotate: open === n ? 45 : 0 }} className="text-2xl text-gold">+</motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === n && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-6 text-muted-foreground">{a}</motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const projectTypes = ["AI Graphic Design", "Character Design", "Thumbnails", "UGC Ads", "AI Film / Video", "Automation", "Website", "Other"];
const budgets = ["Under ₹25k", "₹25k – ₹1L", "₹1L – ₹5L", "₹5L+", "Not sure yet"];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Credits() {
  const [form, setForm] = useState({ name: "", email: "", type: "", budget: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "type" | "message", string>>>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<"name" | "email" | "type" | "message", string>> = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name";
    if (!emailRe.test(form.email.trim())) er.email = "Please enter a valid email";
    if (!form.type) er.type = "Pick a project type";
    if (form.message.trim().length < 10) er.message = "Tell me a little more (10+ characters)";
    if (form.message.length > 2000) er.message = "Keep it under 2000 characters";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
    toast.success("Call sheet received", { description: "I reply to every serious inquiry within one business day." });
  };
  const field = "w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
  const credits: [string, string, string?][] = [
    ["Starring", "Anmol Srivastava"], ["Directed & Edited By", "Anmol Srivastava"], ["Based In", "Gorakhpur, India (Remote)"],
    ["Email", contact.email, `mailto:${contact.email}`], ["Phone", contact.phone, contact.phoneHref],
    ["LinkedIn", "in/anmol-srivastava", contact.linkedin], ["YouTube", "@successpanel-f2k", contact.youtube], ["Site", "asai06.netlify.app", contact.site],
  ];
  return (
    <section id="contact" className="relative py-32">
      <div aria-hidden className="aura absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SceneHead scene="Scene 06 — Credits" title={<>Let's build something<br /><span className="text-gold-grad">extraordinary.</span></>}
          sub="Tell me what you're working on. I reply to every serious inquiry within one business day." />
        <div className="grid gap-16 lg:grid-cols-2">
          <dl className="space-y-5 text-center lg:text-left">
            {credits.map(([k, v, href]) => (
              <Reveal key={k}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{k}</dt>
                <dd className="font-display mt-1 text-3xl md:text-4xl">{href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="hover:text-gold">{v}</a> : v}</dd>
              </Reveal>
            ))}
          </dl>
          <div className="glass relative overflow-hidden rounded-3xl p-8">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-widest">
              <span className="text-gold">CALL SHEET</span><span className="text-muted-foreground">New Production Inquiry</span>
            </div>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-96 flex-col items-center justify-center text-center">
                  <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.1 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-primary-foreground">✓</motion.div>
                  <h3 className="font-display mt-6 text-5xl">That's a wrap.</h3>
                  <p className="mt-2 text-muted-foreground">Thanks {form.name.split(" ")[0]} — I'll be in touch soon.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", type: "", budget: "", message: "" }); }} className="mt-6 text-sm text-gold underline">Send another</button>
                </motion.div>
              ) : (
                <motion.form key="f" onSubmit={submit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
                  {([["name", "Name", "text"], ["email", "Email", "email"]] as const).map(([k, l, t]) => (
                    <label key={k} className="block text-sm"><span className="text-muted-foreground">{l}</span>
                      <input type={t} value={form[k]} onChange={set(k)} maxLength={k === "name" ? 100 : 255} className={`${field} mt-1.5`} aria-invalid={!!errors[k]} />
                      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}</label>
                  ))}
                  <label className="block text-sm"><span className="text-muted-foreground">Project type</span>
                    <select value={form.type} onChange={set("type")} className={`${field} mt-1.5 bg-popover`}><option value="">Select…</option>{projectTypes.map((p) => <option key={p}>{p}</option>)}</select>
                    {errors.type && <span className="mt-1 block text-xs text-destructive">{errors.type}</span>}</label>
                  <label className="block text-sm"><span className="text-muted-foreground">Budget</span>
                    <select value={form.budget} onChange={set("budget")} className={`${field} mt-1.5 bg-popover`}><option value="">Select…</option>{budgets.map((p) => <option key={p}>{p}</option>)}</select></label>
                  <label className="block text-sm sm:col-span-2"><span className="text-muted-foreground">Message</span>
                    <textarea rows={5} value={form.message} onChange={set("message")} maxLength={2000} className={`${field} mt-1.5 resize-none`} />
                    {errors.message && <span className="mt-1 block text-xs text-destructive">{errors.message}</span>}</label>
                  <button type="submit" className="rounded-full bg-primary py-4 font-medium text-primary-foreground shadow-gold sm:col-span-2">Send Message</button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="border-t pb-16 pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <div className="font-display text-4xl">Anmol Srivastava</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">AI Creative Automation Specialist — design, storytelling, and systems for brands moving faster than their headcount.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (!emailRe.test(email)) { toast.error("Please enter a valid email"); return; } toast.success("You're on the list"); setEmail(""); }} className="mt-6 flex max-w-sm gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Newsletter — your email" aria-label="Newsletter email" className="flex-1 rounded-full border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold" />
            <button className="rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Join</button>
          </form>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground"><div className="eyebrow mb-3">Company</div>
          <Link to="/blog" className="block hover:text-foreground">Journal</Link>
          <Link to="/privacy" className="block hover:text-foreground">Privacy Policy</Link>
          <Link to="/terms" className="block hover:text-foreground">Terms</Link></div>
        <div className="space-y-2 text-sm text-muted-foreground"><div className="eyebrow mb-3">Connect</div>
          <a href={`mailto:${contact.email}`} className="block hover:text-foreground">Email</a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="block hover:text-foreground">LinkedIn</a>
          <a href={contact.youtube} target="_blank" rel="noreferrer" className="block hover:text-foreground">YouTube</a></div>
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl justify-between px-6 font-mono text-[10px] tracking-widest text-muted-foreground md:px-10">
        <span>© 2026 Anmol Srivastava. All rights reserved.</span><span className="text-gold">— FIN —</span>
      </div>
    </footer>
  );
}
