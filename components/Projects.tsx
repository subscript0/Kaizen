'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/lib/data';
import { trackProjectView } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const sectionRef    = useRef<HTMLElement>(null);
  const followRef     = useRef<HTMLDivElement>(null);
  const mousePos      = useRef({ x: 0, y: 0 });
  const rafRef        = useRef<number>(0);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouch,      setIsTouch]      = useState(false);

  /* ── detect touch after hydration ───────────────── */
  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  /* ── scroll-triggered row animations ────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-row').forEach((row, i) => {
        gsap.from(row, {
          scrollTrigger: { trigger: row, start: 'top 88%' },
          y: 40,
          opacity: 0,
          duration: 0.75,
          delay: i * 0.07,
          ease: 'power3.out',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── smooth mouse-follow (rAF lerp) ─────────────── */
  useEffect(() => {
    if (isTouch) return;
    let curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener('mousemove', onMove);

    const tick = () => {
      curX += (mousePos.current.x - curX) * 0.12;
      curY += (mousePos.current.y - curY) * 0.12;
      if (followRef.current) {
        followRef.current.style.transform =
          `translate(${curX}px, ${curY}px) translate(-50%, -60%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch]);

  /* ── fade follow image in/out ────────────────────── */
  useEffect(() => {
    if (isTouch || !followRef.current) return;
    gsap.to(followRef.current, {
      opacity:  hoveredIndex !== null ? 1   : 0,
      scale:    hoveredIndex !== null ? 1   : 0.88,
      duration: 0.35,
      ease: hoveredIndex !== null ? 'power2.out' : 'power2.in',
    });
  }, [hoveredIndex, isTouch]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 px-6 lg:px-12 max-w-7xl mx-auto"
      aria-labelledby="projects-heading"
    >
      <p className="section-number mb-4">Work</p>
      <h2 id="projects-heading" className="section-title mb-4">
        Selected Projects
      </h2>
      <p className="text-muted-foreground max-w-lg mb-16 leading-relaxed">
        A selection of production-grade interfaces built for SaaS, fintech,
        and AI companies.
      </p>

      {/* ── Desktop: list with mouse-follow thumbnail ── */}
      <div className="hidden md:block border-t border-border/50">
        {projects.map((project, i) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="project-row block group"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => trackProjectView(project.slug)}
            aria-label={`View ${project.title} case study`}
          >
            <div className="flex items-center justify-between py-7 border-b border-border/50 gap-6">

              {/* Number */}
              <span className="text-xs text-primary font-mono w-10 flex-shrink-0">
                {project.number}
              </span>

              {/* Title + description */}
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-10 overflow-hidden">
                  {project.description}
                </p>
              </div>

              {/* Tech pills */}
              <div className="flex flex-wrap gap-1.5 justify-end max-w-xs flex-shrink-0">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <span
                className="text-xl text-muted-foreground group-hover:text-primary group-hover:translate-x-1.5 transition-all duration-200 flex-shrink-0 ml-2"
                aria-hidden="true"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Desktop: floating thumbnail that follows cursor ── */}
      {!isTouch && (
        <div
          ref={followRef}
          className="fixed top-0 left-0 pointer-events-none z-50 w-[340px] h-[220px] rounded-xl overflow-hidden shadow-2xl border border-white/10"
          style={{ opacity: 0, willChange: 'transform' }}
          aria-hidden="true"
        >
          {hoveredIndex !== null && projects[hoveredIndex] && (
            <Image
              key={projects[hoveredIndex].slug}
              src={projects[hoveredIndex].thumbnail}
              alt={projects[hoveredIndex].title}
              fill
              className="object-cover"
              sizes="340px"
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          {hoveredIndex !== null && projects[hoveredIndex] && (
            <p className="absolute bottom-3 left-3 text-xs font-semibold text-white/90">
              {projects[hoveredIndex].title}
            </p>
          )}
        </div>
      )}

      {/* ── Mobile: card grid ── */}
      <div className="md:hidden grid grid-cols-1 xs:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            onClick={() => trackProjectView(project.slug)}
            className="group block rounded-xl overflow-hidden border border-border bg-background-light hover:border-primary/50 transition-colors"
            aria-label={`View ${project.title}`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 420px) 100vw, 50vw"
              />
              {/* Number badge */}
              <span className="absolute top-2 left-2 text-[10px] font-mono text-primary bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
                {project.number}
              </span>
            </div>

            {/* Card body */}
            <div className="p-3">
              <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {project.description}
              </p>
              {/* Tech pills */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {project.techStack.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 rounded-full"
                  >
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
