import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { contact, projects, scenes, type Project } from "@/lib/content";
import { scrollToId } from "./smooth";

type Ctx = {
  openCmd: () => void;
  openBooking: () => void;
  openProject: (p: Project) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
};
const SiteCtx = createContext<Ctx | null>(null);
export const useSite = () => useContext(SiteCtx)!;

export function SiteProvider({ children }: { children: ReactNode }) {
  const [cmd, setCmd] = useState(false);
  const [booking, setBooking] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("as-theme");
    if (saved === "light") setTheme("light");
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((v) => !v); }
      if (e.key === "Escape") { setCmd(false); setBooking(false); setProject(null); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("as-theme", theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.style.overflow = cmd || booking || project ? "hidden" : "";
  }, [cmd, booking, project]);

  const value = useMemo<Ctx>(() => ({
    openCmd: () => setCmd(true),
    openBooking: () => setBooking(true),
    openProject: setProject,
    theme,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  }), [theme]);

  return (
    <SiteCtx.Provider value={value}>
      {children}
      <CommandMenu open={cmd} onClose={() => setCmd(false)} onProject={(p) => { setCmd(false); setProject(p); }} onBook={() => { setCmd(false); setBooking(true); }} />
      <BookingModal open={booking} onClose={() => setBooking(false)} />
      <CaseStudy project={project} onClose={() => setProject(null)} onBook={() => { setProject(null); setBooking(true); }} />
    </SiteCtx.Provider>
  );
}

function Backdrop({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <motion.div className="fixed inset-0 z-[150] flex items-start justify-center bg-background/70 p-4 pt-[12vh] backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl">{children}</div>
    </motion.div>
  );
}

function CommandMenu({ open, onClose, onProject, onBook }: { open: boolean; onClose: () => void; onProject: (p: Project) => void; onBook: () => void }) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const items = useMemo(() => {
    const all = [
      ...scenes.map((s, n) => ({ group: "Jump to scene", label: `${String(n + 1).padStart(2, "0")} — ${s.label}`, run: () => { onClose(); scrollToId(s.id); } })),
      ...projects.map((p) => ({ group: "Open project", label: p.title, run: () => onProject(p) })),
      { group: "Actions", label: "Copy email", run: () => { navigator.clipboard.writeText(contact.email); toast.success("Email copied", { description: contact.email }); onClose(); } },
      { group: "Actions", label: "Book a discovery call", run: onBook },
    ];
    return all.filter((x) => x.label.toLowerCase().includes(q.toLowerCase()));
  }, [q, onClose, onProject, onBook]);
  useEffect(() => { setI(0); }, [q]);
  useEffect(() => { if (!open) setQ(""); }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <motion.div initial={{ y: -12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} className="glass overflow-hidden rounded-2xl bg-popover" role="dialog" aria-label="Command menu">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scenes, projects, actions…"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setI((v) => Math.min(items.length - 1, v + 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setI((v) => Math.max(0, v - 1)); }
                if (e.key === "Enter") items[i]?.run();
              }}
              className="w-full border-b bg-transparent px-5 py-4 text-base outline-none placeholder:text-muted-foreground" />
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {items.map((it, n) => (
                <li key={it.group + it.label}>
                  {(n === 0 || items[n - 1]!.group !== it.group) && <div className="eyebrow px-3 pb-1 pt-3 text-[10px]">{it.group}</div>}
                  <button onMouseEnter={() => setI(n)} onClick={it.run}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm ${n === i ? "bg-accent text-foreground" : "text-muted-foreground"}`}>{it.label}</button>
                </li>
              ))}
              {!items.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</li>}
            </ul>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass rounded-2xl bg-popover p-8" role="dialog" aria-label="Book a discovery call">
            <div className="flex items-start justify-between">
              <div>
                <div className="eyebrow">Call Sheet — Discovery</div>
                <h3 className="font-display mt-3 text-5xl">Book a Discovery Call</h3>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-2xl text-muted-foreground hover:text-foreground">×</button>
            </div>
            <p className="mt-4 text-muted-foreground">A 30-minute conversation to understand what you're trying to build and whether it's a fit.</p>
            <div className="mt-6 flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gold/40 text-center">
              <span className="eyebrow">[ Placeholder ]</span>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">Calendly scheduling embed goes here once your booking link is added.</p>
            </div>
            <a href={`mailto:${contact.email}?subject=Discovery%20call`} className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Email to schedule instead</a>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}

function CaseStudy({ project, onClose, onBook }: { project: Project | null; onClose: () => void; onBook: () => void }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[150] overflow-y-auto bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          role="dialog" aria-label={project.title} data-lenis-prevent>
          <button onClick={onClose} className="glass fixed right-6 top-8 z-10 rounded-full px-5 py-3 font-mono text-xs" data-cursor="CLOSE">ESC ×</button>
          <motion.div layoutId={`img-${project.slug}`} className="relative h-[70vh] w-full overflow-hidden">
            <img src={project.image} alt={project.alt} className="grade h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-10 left-6 md:left-16">
              <span className="timecode">{project.timecode}</span>
              <div className="eyebrow mt-4">{project.category}</div>
              <h2 className="font-display mt-2 text-6xl md:text-9xl">{project.title}</h2>
            </div>
          </motion.div>
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-3">
            <div className="md:col-span-2 space-y-10">
              <section><div className="eyebrow">Overview</div><p className="mt-4 text-xl leading-relaxed">{project.overview}</p></section>
              <section><div className="eyebrow">Process</div>
                <p className="mt-4 text-muted-foreground">Discovery → Prompt Engineering → Creation → Testing → Delivery. <span className="text-gold">[Placeholder — add the project's real process notes.]</span></p></section>
              {project.video && <video src={project.video} poster={project.image} controls playsInline className="w-full rounded-2xl" />}
              <section><div className="eyebrow">Results</div><p className="mt-4 text-muted-foreground"><span className="text-gold">[Placeholder — add real results when available.]</span></p></section>
            </div>
            <aside className="glass h-fit space-y-6 rounded-2xl p-6">
              <div><div className="eyebrow">Category</div><p className="mt-2">{project.category}</p></div>
              <div><div className="eyebrow">Tools</div><p className="mt-2 text-muted-foreground">[Placeholder]</p></div>
              <button onClick={onBook} className="w-full rounded-full bg-primary py-3 font-medium text-primary-foreground">Start a similar project</button>
            </aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
