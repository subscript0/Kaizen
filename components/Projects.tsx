'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/lib/data';
import { trackProjectView } from '@/lib/utils';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef  = useRef<HTMLElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const shellRef    = useRef<HTMLDivElement>(null);
  const mousePos    = useRef({ x: -9999, y: -9999 });
  const curPos      = useRef({ x: -9999, y: -9999 });
  const rafRef      = useRef<number>(0);
  const isHovering  = useRef(false);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouch,      setIsTouch]      = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  // ── Row entrance animations ───────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-row').forEach((row, i) => {
        gsap.from(row, {
          scrollTrigger: { trigger: row, start: 'top 88%' },
          y: 40, opacity: 0, duration: 0.75, delay: i * 0.08, ease: 'power3.out',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── rAF mouse-follow ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const tick = () => {
      const lerp = 0.1;
      curPos.current.x += (mousePos.current.x - curPos.current.x) * lerp;
      curPos.current.y += (mousePos.current.y - curPos.current.y) * lerp;
      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `translate(${curPos.current.x}px, ${curPos.current.y}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch]);

  // ── Show / hide hover image ───────────────────────────────────────────────
  const handleEnter = (i: number) => {
    if (isTouch) return;
    isHovering.current = true;
    setHoveredIndex(i);
    if (shellRef.current) {
      gsap.killTweensOf(shellRef.current);
      gsap.to(shellRef.current, {
        opacity: 1, visibility: 'visible',
        scale: 1, duration: 0.4, ease: 'power2.out',
      });
    }
  };

  const handleLeave = () => {
    if (isTouch) return;
    isHovering.current = false;
    setHoveredIndex(null);
    if (shellRef.current) {
      gsap.killTweensOf(shellRef.current);
      gsap.to(shellRef.current, {
        opacity: 0, scale: 0.88, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
          if (shellRef.current) shellRef.current.style.visibility = 'hidden';
        },
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="projects-heading"
    >
      <p className="section-number mb-4">Work</p>
      <h2 id="projects-heading" className="section-title mb-4">Selected Projects</h2>
      <p className="text-muted-foreground max-w-lg mb-16 leading-relaxed">
        A selection of production-grade interfaces built for SaaS, fintech, and AI companies.
      </p>

      {/* ── Desktop list ── */}
      <div className="hidden md:block border-t border-border/50">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="project-row block group"
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={handleLeave}
            onClick={() => trackProjectView(project.slug)}
            aria-label={`View ${project.title} case study`}
          >
            <div className="flex items-center justify-between py-7 border-b border-border/50 gap-6">
              <span className="text-xs text-primary font-mono w-10 flex-shrink-0">
                {project.number}
              </span>

              <div className="flex-1 min-w-0">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-xl overflow-hidden
                              opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-12 transition-all duration-300">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 justify-end max-w-xs flex-shrink-0">
                {project.techStack.slice(0, 3).map(tech => (
                  <span key={tech}
                    className="text-[11px] text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>

              <span
                className="text-xl text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300 flex-shrink-0 ml-2"
                aria-hidden="true"
              >→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Cursor-follow image (fixed, desktop only) ── */}
      <div
        ref={wrapperRef}
        className="fixed top-0 left-0 pointer-events-none z-[999]"
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      >
        {/* offset: centres card above-right of cursor tip */}
        <div style={{ transform: 'translate(-50%, -65%)' }}>
          <div
            ref={shellRef}
            className="w-[340px] h-[220px] rounded-xl overflow-hidden shadow-2xl"
            style={{
              opacity: 0,
              visibility: 'hidden',
              transform: 'scale(0.88)',  /* ← correct CSS, not the GSAP prop */
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {hoveredIndex !== null && projects[hoveredIndex] && (
              <>
                <Image
                  key={projects[hoveredIndex].slug}
                  src={projects[hoveredIndex].thumbnail}
                  alt={projects[hoveredIndex].title}
                  fill
                  className="object-cover"
                  sizes="340px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">
                    {projects[hoveredIndex].title}
                  </p>
                  <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    View →
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile card grid ── */}
      <div className="md:hidden grid grid-cols-1 xs:grid-cols-2 gap-4">
        {projects.map(project => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            onClick={() => trackProjectView(project.slug)}
            className="group block rounded-xl overflow-hidden border bg-background-light hover:border-primary/50 transition-all duration-300"
            style={{ borderColor: 'hsl(var(--border))' }}
            aria-label={`View ${project.title}`}
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 420px) 100vw, 50vw"
              />
              <span className="absolute top-2 left-2 text-[10px] font-mono text-primary bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
                {project.number}
              </span>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors"
                style={{ color: 'hsl(var(--foreground))' }}>
                {project.title}
              </h3>
              <p className="text-[11px] leading-relaxed line-clamp-2"
                style={{ color: 'hsl(var(--muted-foreground))' }}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {project.techStack.slice(0, 2).map(tech => (
                  <span key={tech}
                    className="text-[10px] border px-1.5 py-0.5 rounded-full"
                    style={{ color: 'hsl(var(--muted-foreground))', borderColor: 'hsl(var(--border))' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
