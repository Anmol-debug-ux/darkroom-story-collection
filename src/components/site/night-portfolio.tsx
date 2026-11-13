import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Expand, Linkedin, Mail, Youtube } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { media, projects } from '@/lib/content';
import { profile, portfolioTools, selectedWork, records, skills } from '@/lib/portfolio';

const nav = ['About', 'Journey', 'Work', 'Skills', 'Contact'];
const filters = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}
function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => setT(new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date()) + ' IST');
    f(); const id = setInterval(f, 30000); return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
}
function Loader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setGone(true); return; }
    let raf = 0; const start = performance.now();
    const tick = (now: number) => { const p = Math.min(100, Math.round((now - start) / 14)); setPct(p); if (p < 100) raf = requestAnimationFrame(tick); else setTimeout(() => setGone(true), 350); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, []);
  if (gone) return null;
  return <div className={`np-loader ${pct === 100 ? 'is-done' : ''}`} aria-hidden="true"><div><p className="np-loader-name">Anmol Srivastava.</p><span className="np-loader-line" style={{ transform: `scaleX(${pct / 100})` }} /><p className="np-mono">{profile.role}</p></div><span className="np-mono np-loader-pct">{pct}%</span></div>;
}
function Heading({ n, label, children }: { n: string; label: string; children: ReactNode }) {
  return <div className="np-heading" data-reveal><span className="np-mono">{n} — {label}</span><h2>{children}</h2></div>;
}

export function NightPortfolio() {
  useReveal();
  const [filter, setFilter] = useState('All');
  const [preview, setPreview] = useState<(typeof projects)[number] | null>(null);
  const aboutText = "I'm an AI artist and creative automation specialist studying B.Tech at MMMUT, Gorakhpur. I spend my time where creativity meets technology — designing visuals, directing AI video, and connecting it all with automation.";
  return <div className="np-page">
    <Loader />
    <a href="#main" className="np-skip">Skip to content</a>
    <header className="np-nav"><a href="#top" className="np-logo">Anmol<span>.</span></a><nav aria-label="Main">{nav.map(n => <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>)}</nav><a className="np-nav-cta" href={`mailto:${profile.email}`}>Let's talk</a></header>
    <main id="main">
      <section id="top" className="np-hero">
        <img src={media.portrait} alt="Portrait of Anmol Srivastava" className="np-hero-img" />
        <div className="np-hero-shade" />
        <div className="np-hero-content">
          <p className="np-mono np-hero-meta"><span>{profile.role}</span><span>{profile.city} — <Clock /></span></p>
          <h1>Anmol<br />Srivastava<span>.</span></h1>
          <p className="np-hero-bio">{profile.bio}</p>
          <p className="np-words"><b>Designer</b><b>Creator</b><b>Automator</b><b>Student</b></p>
          <div className="np-ctas"><a href="#work" className="np-btn np-btn-solid">Explore my work</a><a href="#contact" className="np-btn">Let's connect</a></div>
          <p className="np-status"><i /> Open to creative & automation projects</p>
        </div>
        <a href="#about" className="np-scroll np-mono">Scroll</a>
      </section>

      <section id="about" className="np-section">
        <Heading n="01" label="About">About Anmol</Heading>
        <p className="np-about" data-reveal>{aboutText.split(' ').map((w, i) => <span key={i} style={{ transitionDelay: `${i * 18}ms` }}>{w} </span>)}</p>
        <div className="np-about-grid">
          <p data-reveal>My work spans graphic design, character concepts, AI video and student-guidance content on Success Panel. I use n8n, Zapier and Make to turn creative work into repeatable systems.</p>
          <p data-reveal className="np-mono np-interests">Interests — AI art · Character design · AI films · Prompt engineering · Automation · Hackathons · EdTech</p>
        </div>
      </section>

      <section id="journey" className="np-section">
        <Heading n="02" label="Journey">Still building. Always learning.</Heading>
        <ol className="np-timeline">{records.map((r, i) => <li key={r.title} data-reveal><span className="np-mono np-tl-num">{String(i + 1).padStart(2, '0')}</span><span className="np-mono np-tl-date">{r.date}</span><div><h3>{r.title}</h3><p className="np-tl-org">{r.detail}</p><p>{r.label}</p></div></li>)}</ol>
      </section>

      <section id="work" className="np-section">
        <Heading n="03" label="Work">Selected projects.</Heading>
        <div className="np-projects">{selectedWork.map((p, i) => <article key={p.title} className="np-project" data-reveal><span className="np-mono np-proj-num">{String(i + 1).padStart(2, '0')}</span><div><p className="np-mono np-accent">{p.category}</p><h3>{p.title}</h3><p>{p.summary}</p><ul>{p.tags.map(t => <li key={t}>{t}</li>)}</ul>{p.href && <a href={p.href} target="_blank" rel="noreferrer" className="np-link">{p.linkLabel} <ArrowUpRight size={14} /></a>}</div></article>)}</div>
        <div className="np-gallery-head" data-reveal><h3>Creative collection</h3><div className="np-filters" role="group" aria-label="Filter designs">{filters.map(f => <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
        <div className="np-gallery">{projects.filter(p => filter === 'All' || p.category === filter).map((p, i) => <button key={p.slug} className="np-tile" onClick={() => setPreview(p)} aria-label={`View ${p.title}`}><img src={p.image} alt={p.alt} loading="lazy" /><span className="np-tile-info"><span className="np-mono">{String(i + 1).padStart(2, '0')} · {p.category}</span><b>{p.title}</b></span><Expand className="np-tile-icon" size={16} /></button>)}</div>
      </section>

      <section id="skills" className="np-section">
        <Heading n="04" label="Skills">What I work with.</Heading>
        <ol className="np-skills">{[...skills.map(s => ({ title: s.label.split('/ ')[1] ?? s.label, items: s.items.join(', ') })), { title: 'TOOLS', items: portfolioTools.join(', ') }].map((s, i) => <li key={s.title} data-reveal><span className="np-mono">{String(i + 1).padStart(2, '0')}</span><h3>{s.title.charAt(0) + s.title.slice(1).toLowerCase()}</h3><p>{s.items}</p></li>)}</ol>
      </section>

      <section id="contact" className="np-section np-contact">
        <span className="np-mono" data-reveal>05 — Contact</span>
        <h2 data-reveal>Have an idea?<br /><em>Let's make it real.</em></h2>
        <a href={`mailto:${profile.email}`} className="np-email" data-reveal>{profile.email} <ArrowUpRight /></a>
        <div className="np-socials" data-reveal><a href={`mailto:${profile.email}`} aria-label="Email"><Mail size={18} /> Email</a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18} /> LinkedIn</a><a href={profile.youtube} target="_blank" rel="noreferrer"><Youtube size={18} /> YouTube</a></div>
      </section>
    </main>
    <footer className="np-footer np-mono"><span>© 2026 Anmol Srivastava</span><span><Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link></span><a href="#top">Back to top ↑</a></footer>
    <Dialog open={preview !== null} onOpenChange={o => { if (!o) setPreview(null); }}>
      <DialogContent className="z-[100] max-h-[90svh] w-[calc(100%-24px)] max-w-5xl overflow-auto">
        <DialogTitle>{preview?.title}</DialogTitle><DialogDescription>{preview?.category}</DialogDescription>
        {preview && <img src={preview.image} alt={preview.alt} className="max-h-[70svh] w-full object-contain" />}
      </DialogContent>
    </Dialog>
  </div>;
}
