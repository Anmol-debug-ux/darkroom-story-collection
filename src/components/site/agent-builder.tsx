import { useEffect, useRef, useState } from 'react';
import { Bot, Pause, Play, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { agentCount, resolveAgents } from '@/lib/agent-policy';

const names = ['Scout', 'Layout', 'Typeset', 'Motion', 'QA', 'Deploy', 'Copy', 'Lint', 'Index', 'Render'];
type Job = { el: HTMLElement; start: number; slot: number; text: string | null };
export function AgentBuilder() {
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [tour, setTour] = useState(false);
  const [boot, setBoot] = useState(true);
  const [revision, setRevision] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const control = useRef({ enabled: false, paused: false, tour: false });
  control.current = { enabled, paused, tour };
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('portfolio-agents'); } catch { /* Optional browser storage. */ }
    setEnabled(resolveAgents(location.search, saved, matchMedia('(prefers-reduced-motion: reduce)').matches));
    setBoot(false);
  }, []);
  function toggle() {
    setEnabled(value => {
      try { localStorage.setItem('portfolio-agents', value ? 'off' : 'on'); } catch { /* Optional browser storage. */ }
      return !value;
    });
  }
  function startTour() { setPaused(false); setEnabled(true); setTour(true); window.scrollTo(0, 0); setRevision(v => v + 1); }
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && (event.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName))) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.toLowerCase() === 't') startTour();
      if (event.key.toLowerCase() === 'a') toggle();
      if (event.key.toLowerCase() === 'p') setPaused(v => !v);
      if (event.key === 'Escape' || ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) setTour(false);
    };
    const stop = () => setTour(false);
    const pointerStop = (event: PointerEvent) => { if (!(event.target instanceof Element) || !event.target.closest('.agent-dock')) setTour(false); };
    window.addEventListener('keydown', key);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('pointerdown', pointerStop);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('wheel', stop); window.removeEventListener('touchmove', stop); window.removeEventListener('pointerdown', pointerStop); };
  }, []);
  useEffect(() => {
    if (boot) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-build]'));
    document.documentElement.classList.remove('build-mode');
    if (!enabled) {
      elements.forEach(el => { el.style.visibility = ''; el.style.clipPath = ''; el.style.transform = ''; });
      return;
    }
    const eligible = new Set<HTMLElement>();
    const done = new Set<HTMLElement>();
    const jobs: Job[] = [];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting && entry.target instanceof HTMLElement) eligible.add(entry.target);
    }), { rootMargin: '0px 0px 30px 0px' });
    elements.forEach(el => { el.style.visibility = 'hidden'; el.style.clipPath = ''; observer.observe(el); });
    let frame = 0, clock = 0, previous = performance.now(), tourStart: number | null = null;
    const count = agentCount(window.innerWidth);
    const finish = (job: Job) => {
      if (job.text !== null) job.el.textContent = job.text;
      job.el.style.visibility = 'visible'; job.el.style.clipPath = ''; job.el.style.transform = '';
      done.add(job.el);
      const cursor = refs.current[job.slot];
      if (cursor) cursor.style.opacity = '0';
    };
    const tick = (now: number) => {
      const delta = Math.min(now - previous, 60); previous = now;
      if (!control.current.paused) {
        clock += delta;
        elements.forEach(el => {
          if (!done.has(el) && !jobs.some(job => job.el === el) && el.getBoundingClientRect().bottom < 0) {
            el.style.visibility = 'visible'; done.add(el);
          }
        });
        for (const el of elements) {
          if (jobs.length >= 6) break;
          if (!eligible.has(el) || done.has(el) || jobs.some(j => j.el === el)) continue;
          const slot = Array.from({ length: count }, (_, i) => i).find(i => !jobs.some(j => j.slot === i));
          if (slot === undefined) break;
          const text = el.dataset['build'] === 'type' && el.children.length === 0 ? el.textContent : null;
          jobs.push({ el, start: clock + slot * 65, slot, text });
        }
        for (let i = jobs.length - 1; i >= 0; i--) {
          const job = jobs[i]; if (!job) continue;
          const progress = Math.max(0, Math.min(1, (clock - job.start) / 1200));
          const rect = job.el.getBoundingClientRect();
          const cursor = refs.current[job.slot];
          if (cursor) {
            cursor.style.opacity = progress > 0 ? '1' : '0';
            cursor.style.transform = `translate(${rect.left + rect.width * Math.min(1, progress * 2)}px, ${rect.top + rect.height * Math.min(1, progress * 2)}px)`;
            const box = cursor.querySelector<HTMLElement>('.agent-wire');
            if (box) { box.style.width = `${rect.width * Math.min(1, progress * 2)}px`; box.style.height = `${rect.height * Math.min(1, progress * 2)}px`; }
          }
          if (progress > .3) {
            job.el.style.visibility = 'visible';
            const reveal = Math.min(1, (progress - .3) / .7);
            if (job.text !== null) job.el.textContent = job.text.slice(0, Math.ceil(job.text.length * reveal));
            else if (job.el.dataset['build'] === 'wipe') job.el.style.clipPath = `inset(0 ${100 - reveal * 100}% 0 0)`;
            else job.el.style.transform = `translateY(${(1 - reveal) * 12}px) scale(${.96 + reveal * .04})`;
          }
          if (progress === 1) { finish(job); jobs.splice(i, 1); }
        }
        if (control.current.tour) {
          const heroDone = elements.filter(el => el.closest('#hero')).every(el => done.has(el));
          if (heroDone && tourStart === null) tourStart = clock;
          if (tourStart !== null) {
            const max = document.documentElement.scrollHeight - innerHeight;
            const duration = Math.max(12, max / 120 + 4);
            const t = Math.max(0, Math.min(1, ((clock - tourStart) / 1000 - 1) / duration));
            const ramp = .1;
            const eased = t < ramp ? t * t / (2 * ramp * (1 - ramp)) : t > 1 - ramp ? 1 - (1 - t) ** 2 / (2 * ramp * (1 - ramp)) : (t - ramp / 2) / (1 - ramp);
            window.scrollTo(0, max * eased);
            if (t === 1) setTour(false);
          }
        } else tourStart = null;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); jobs.forEach(finish); refs.current.forEach(el => { if (el) el.style.opacity = '0'; }); };
  }, [enabled, revision, boot]);
  return <>
    {boot && <div className="agent-boot"><Bot size={28} /><span>INITIALIZING / ANMOL'S PORTFOLIO</span></div>}
    <div className="agent-layer" aria-hidden="true">{names.map((name, i) => <div className={`agent-cursor agent-${i % 3}`} key={name} ref={el => { refs.current[i] = el; }}>
      <div className="agent-wire"><i /><i /><i /><i /></div>
      <svg width="23" height="29" viewBox="0 0 23 29"><path d="M2 2v23l6-6 5 9 4-2-5-9h9Z" fill="currentColor" /></svg>
      <span className="agent-name"><Bot size={13} /><b className="agent-led" />{name}</span>
    </div>)}</div>
    <div className="agent-dock" aria-label="Animation controls">
      <span className={`dock-status ${enabled ? 'is-on' : ''}`} /><span className="dock-label">AGENT MODE</span>
      <Button variant="ghost" size="icon" title={paused ? 'Resume (P)' : 'Pause (P)'} aria-label={paused ? 'Resume animation' : 'Pause animation'} disabled={!enabled} onClick={() => setPaused(v => !v)}>{paused ? <Play /> : <Pause />}</Button>
      <span className="dock-divider" />
      <Button variant="ghost" className="dock-agents" aria-pressed={enabled} title="Toggle agents (A)" onClick={toggle}><Bot />Agents <span className="text-muted-foreground">{enabled ? 'on' : 'off'}</span></Button>
      <Button variant={tour ? 'secondary' : 'default'} title={tour ? 'Stop tour (Esc)' : 'Replay tour (T)'} onClick={tour ? () => setTour(false) : startTour}>{tour ? <X /> : <RotateCcw />}{tour ? 'Stop' : 'Tour'}</Button>
    </div>
  </>;
}