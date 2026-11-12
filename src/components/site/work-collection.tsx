import { useState } from 'react';
import { Expand, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { projects, films } from '@/lib/content';

type Preview = { title: string; category: string; image: string; video?: string };
export function WorkCollection() {
  const [preview, setPreview] = useState<Preview | null>(null);
  return <>
    <div className="mb-7 mt-14 flex flex-wrap items-end justify-between gap-4">
      <div><span className="portfolio-label text-primary" data-build="type">DESIGN / VISUAL WORK</span><h3 className="mt-3 text-2xl font-medium" data-build="type">The creative collection.</h3></div>
      <span className="portfolio-label">08 / SELECTED DESIGNS</span>
    </div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => <article key={project.slug} className="group overflow-hidden rounded-md border bg-card" data-build="pop">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-secondary">
          <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
          <Button variant="secondary" size="icon" className="absolute bottom-3 right-3" title={`View ${project.title}`} aria-label={`View ${project.title}`} onClick={() => setPreview({ title: project.title, category: project.category, image: project.image })}><Expand /></Button>
        </div>
        <div className="p-5"><span className="portfolio-label">{project.category}</span><h4 className="mt-2 text-lg font-medium">{project.title}</h4></div>
      </article>)}
    </div>
    <div className="mb-7 mt-14 flex flex-wrap items-end justify-between gap-4">
      <div><span className="portfolio-label text-primary" data-build="type">VIDEO / ANIMATION</span><h3 className="mt-3 text-2xl font-medium" data-build="type">Work in motion.</h3></div>
      <span className="portfolio-label">03 / VIDEO PROJECTS</span>
    </div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {films.map(film => <article key={film.title} className="overflow-hidden rounded-md border bg-card" data-build="pop">
        <div className="relative aspect-video bg-secondary">
          <img src={film.poster} alt={film.title} loading="lazy" className="h-full w-full object-contain" />
          <Button variant="default" size="icon" className="absolute bottom-3 right-3" title={`Play ${film.title}`} aria-label={`Play ${film.title}`} onClick={() => setPreview({ title: film.title, category: film.category, image: film.poster, video: film.src })}><Play /></Button>
        </div>
        <div className="p-5"><span className="portfolio-label">{film.category}</span><h4 className="mt-2 text-lg font-medium">{film.title}</h4></div>
      </article>)}
    </div>
    <Dialog open={preview !== null} onOpenChange={open => { if (!open) setPreview(null); }}>
      <DialogContent className="z-[100] max-h-[90svh] w-[calc(100%-24px)] max-w-5xl overflow-auto rounded-md">
        <DialogTitle className="pr-8">{preview?.title}</DialogTitle>
        <DialogDescription>{preview?.category}</DialogDescription>
        {preview && (preview.video ? <video key={preview.video} src={preview.video} poster={preview.image} controls autoPlay playsInline preload="metadata" aria-label={preview.title} className="max-h-[70svh] w-full bg-secondary" /> : <img src={preview.image} alt={preview.title} className="max-h-[70svh] w-full object-contain" />)}
      </DialogContent>
    </Dialog>
  </>;
}