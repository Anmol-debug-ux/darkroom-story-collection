import { ArrowUpRight, ArrowDown, MapPin, Mail, Linkedin, Youtube, ArrowUp, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import portrait from '@/assets/anmol-slim-suit-portrait.png';
import { profile, portfolioTools, selectedWork, records, skills } from '@/lib/portfolio';
import { AgentBuilder } from './agent-builder';
import { WorkCollection } from './work-collection';

const nav = ['Work', 'Stack', 'Record', 'About', 'Contact'];
function SectionTitle({ number, label, title }: { number: string; label: string; title: string }) {
  return <div className="section-title"><span className="portfolio-label" data-build="type">{number} / {label}</span><h2 data-build="wipe">{title}</h2></div>;
}
export function AgentPortfolio() {
  return <div className="portfolio-page">
    <header className="portfolio-nav"><a href="#hero" className="portfolio-monogram" aria-label="Anmol Srivastava home">as<span>.</span></a><nav aria-label="Main navigation">{nav.map(item => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav><Button asChild variant="outline" className="nav-contact"><a href={`mailto:${profile.email}`}>Let's talk <ArrowUpRight /></a></Button></header>
    <main>
      <section id="hero" className="portfolio-hero">
        <div className="hero-topline"><span className="portfolio-label">CREATIVE INTELLIGENCE / HUMAN TOUCH</span><span className="portfolio-label">PORTFOLIO — 2026</span></div>
        <div className="portfolio-word" aria-hidden="true" data-build="wipe">PORTFOLIO</div>
        <img className="portfolio-portrait" src={portrait} alt="Anmol Srivastava in a black suit" data-build="pop" />
        <div className="hero-intro">
          <p className="handwritten" data-build="type">Hello, I'm</p>
          <h1 data-build="wipe">ANMOL<br />SRIVASTAVA<span>.</span></h1>
          <p className="hero-role" data-build="type">{profile.role}</p>
          <p className="hero-bio" data-build="type">{profile.bio}</p>
          <div data-build="pop"><Button asChild className="work-button"><a href="#work">View work <ArrowUpRight /></a></Button></div>
          <p className="hero-location" data-build="type"><MapPin size={12} /> Based in {profile.city}</p>
        </div>
        <aside className="hero-facts" aria-label="Areas of practice">
          {[['01', 'DESIGN', 'Ideas into visuals.'], ['02', 'AI PRODUCTION', 'Stories into motion.'], ['03', 'AUTOMATION', 'Processes into systems.']].map(([n, title, sub]) => <div key={n} data-build="pop"><span className="fact-number">{n}</span><p>{title}</p><small>{sub}</small></div>)}
        </aside>
        <div className="hero-bottom"><span className="portfolio-label">DESIGN × AI × AUTOMATION</span><a href="#work" aria-label="Scroll to work"><ArrowDown size={16} /> SELECTED WORK BELOW</a><span className="portfolio-label">BUILT WITH INTENT.</span></div>
      </section>
      <section id="work" className="portfolio-section">
        <div className="section-heading-row"><SectionTitle number="01" label="PROJECTS & CREATIVE WORK" title="Work that ships." /><p className="section-aside" data-build="type">Projects, design, and motion.<br />My complete portfolio collection.</p></div>
        <div className="work-grid">{selectedWork.map((project, index) => <article className="work-card" key={project.title} data-build="pop"><div className="work-card-top"><span className="portfolio-label">{project.category}</span><span className="work-index">/{String(index + 1).padStart(2, '0')}</span></div><h3>{project.title}</h3><p>{project.summary}</p><ul>{project.points.map(point => <li key={point}>{point}</li>)}</ul><div className="work-card-bottom"><div className="tech-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{project.href && <a href={project.href} target="_blank" rel="noreferrer">{project.linkLabel} <ArrowUpRight size={14} /></a>}</div></article>)}</div>
        <WorkCollection />
      </section>
      <section id="stack" className="portfolio-stack"><div className="portfolio-section stack-heading"><span className="portfolio-label" data-build="type">02 / THE TOOLKIT</span><p data-build="type">A creative mind. A connected stack.</p></div><div className="stack-window"><div className="stack-track">{[0, 1].map(copy => <div key={copy} aria-hidden={copy === 1}>{portfolioTools.map(tool => <span key={tool}>{tool}<Plus size={16} /></span>)}</div>)}</div></div></section>
      <section id="record" className="portfolio-section record-section"><SectionTitle number="03" label="THE JOURNEY" title="Still building. Always learning." /><div className="record-list">{records.map(record => <article data-build="pop" key={record.title}><span className="portfolio-label">{record.date}</span><div><h3>{record.title}</h3><p>{record.detail}</p></div><span className="record-note">{record.label}</span><ArrowUpRight size={19} /></article>)}</div></section>
      <section id="about" className="portfolio-section about-section"><div><SectionTitle number="04" label="BEHIND THE WORK" title="Human curiosity. Artificial intelligence." /><div className="about-copy"><p data-build="type">I'm Anmol, an AI artist and creative automation specialist based in Gorakhpur, India. I'm studying B.Tech at MMMUT while exploring the intersection of creativity and technology.</p><p data-build="type">My work spans graphic design, character concepts, AI video, and student-guidance content. I also use n8n, Zapier, and Make to connect creative work with automation.</p></div></div><div className="skills-grid">{skills.map(skill => <div key={skill.label} data-build="pop"><span className="portfolio-label">{skill.label}</span>{skill.items.map(item => <p key={item}>{item}</p>)}</div>)}</div><div className="principles">{['Stay curious.', 'Create with intent.', 'Keep it human.', 'Keep building.'].map((text, index) => <div data-build="type" key={text}><span>0{index + 1}</span>{text}</div>)}</div></section>
      <section id="contact" className="portfolio-section contact-section"><span className="portfolio-label" data-build="type">05 / YOUR NEXT IDEA</span><h2 data-build="wipe">LET'S MAKE<br />SOMETHING <span>REAL.</span></h2><div className="contact-bottom"><a className="contact-email" href={`mailto:${profile.email}`} data-build="type">{profile.email}<ArrowUpRight /></a><div className="socials" data-build="pop"><Button asChild variant="outline" size="icon" title="Email"><a href={`mailto:${profile.email}`} aria-label="Email Anmol"><Mail /></a></Button><Button asChild variant="outline" size="icon" title="LinkedIn"><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="Anmol on LinkedIn"><Linkedin /></a></Button><Button asChild variant="outline" size="icon" title="YouTube"><a href={profile.youtube} target="_blank" rel="noreferrer" aria-label="Success Panel on YouTube"><Youtube /></a></Button></div></div></section>
    </main>
    <footer className="portfolio-footer"><a href="#hero" className="portfolio-monogram">as<span>.</span></a><span>© 2026 ANMOL SRIVASTAVA</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><a href="#hero" aria-label="Back to top"><ArrowUp size={16} /></a></div></footer>
    <AgentBuilder />
  </div>;
}