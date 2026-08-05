'use client';

import { useRef } from 'react';
import { testimonials } from '@/lib/data';
import { drawIn, gsap, revealOnScroll, useIsoLayoutEffect } from '@/lib/motion';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';
import { useSectionIntro } from '@/components/motion/useSectionIntro';
import SectionHead from '@/components/SectionHead';

// The local /testimonials/*.jpg avatars 404, so we map each entry to a
// known-good Unsplash portrait keyed by id (falls back to the first).
const PORTRAITS: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  2: 'https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D',
};
const FALLBACK_PORTRAIT = PORTRAITS[1];

// Adapt our data model → the shape CircularTestimonials expects.
const items = testimonials.map((t) => ({
  quote: t.content,
  name: t.name,
  designation: `${t.role} · ${t.company}`,
  src: PORTRAITS[t.id] ?? FALLBACK_PORTRAIT,
}));

/**
 * What clients say.
 *
 * The carousel itself owns its own motion (it lives in `components/ui`), so
 * the work here is the frame around it: the header introduces itself in the
 * site's shared order, a spec bar counts what you are looking at, and the
 * whole block rises in once — deliberately less motion than the sections
 * above it, because a testimonial is somebody else's words and a section that
 * performs over them reads as a sales page.
 */
export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useSectionIntro(sectionRef);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];
      cleanups.push(drawIn('[data-rule]', { duration: 0.8, stagger: 0.08, start: 'top 94%' }));
      cleanups.push(
        revealOnScroll('[data-reveal]', { y: 26, duration: 0.66, stagger: 0.1, start: 'top 88%' }),
      );
      return () => cleanups.forEach((c) => c());
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="bg-background py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="measure">
        <SectionHead
          index="05"
          label="Social proof"
          id="testimonials-heading"
          title="What clients say."
          className="mb-10 md:mb-12"
        />

        {/* Metadata band straddling a rule that strokes itself in — the count
            is real, read off the data rather than typed in. */}
        <div className="relative pt-4">
          <span
            data-rule
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-[hsl(var(--foreground)_/0.14)]"
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2" data-reveal>
            <span className="micro">
              {items.length} {items.length === 1 ? 'Reference' : 'References'}
            </span>
            <span className="micro">Verified engagements</span>
            <span className="micro micro--strong">Auto-advancing</span>
          </div>
        </div>

        {/* Circular, autoplaying testimonial carousel — themed to the ink palette
            via CSS variables so it tracks the active theme (light/dark + accent). */}
        <div className="mt-12 flex justify-center" data-reveal>
          <CircularTestimonials
            testimonials={items}
            autoplay
            colors={{
              name: 'hsl(var(--foreground))',
              designation: 'hsl(var(--muted-foreground))',
              testimony: 'hsl(var(--foreground))',
              arrowBackground: 'hsl(var(--foreground))',
              arrowForeground: 'hsl(var(--background))',
              arrowHoverBackground: 'hsl(var(--primary))',
            }}
            fontSizes={{
              name: '1.75rem',
              designation: '0.9rem',
              quote: '1.15rem',
            }}
          />
        </div>

        <div className="relative mt-14">
          <span
            data-rule
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-[hsl(var(--foreground)_/0.14)]"
          />
        </div>
      </div>
    </section>
  );
}
