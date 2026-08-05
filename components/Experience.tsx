'use client';

import { useCallback, useRef, useState } from 'react';
import { experiences } from '@/lib/data';
import {
  drawIn,
  gsap,
  revealOnScroll,
  scrubScale,
  trackActiveItem,
  useIsoLayoutEffect,
} from '@/lib/motion';
import { useSectionIntro } from '@/components/motion/useSectionIntro';
import SectionHead from '@/components/SectionHead';

/**
 * Selected experience — a résumé index with a spine.
 *
 * The storytelling here is literal: a hairline runs down the left of the list
 * and an accent segment fills it as you read, scrubbed to scroll position, so
 * the page shows you how far through a career you are. Each role's marker
 * lights when the spine reaches it.
 *
 * Everything moving is a `transform` on an absolutely-positioned 1px element,
 * which is about the cheapest thing a browser can animate — no layout, no
 * paint beyond a single composited layer, and it costs the same at 390px as at
 * 1440px.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);

  useSectionIntro(sectionRef);

  const onActive = useCallback((i: number) => setActive(i), []);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];
      const entries = gsap.utils.toArray<HTMLElement>('[data-entry]', list);

      // Lines inside one role enter together, so the batch staggers them as a
      // block: title, dates, company, summary, then each highlight. That
      // order is the choreography — a résumé entry read out loud.
      cleanups.push(
        revealOnScroll('[data-line]', { y: 18, duration: 0.56, stagger: 0.055, start: 'top 88%' }),
      );

      cleanups.push(drawIn('[data-entry-rule]', { duration: 0.75, stagger: 0.1, delay: 0.1 }));

      // The spine fills as the reader moves through the list.
      if (spineRef.current) {
        cleanups.push(
          scrubScale(spineRef.current, {
            axis: 'y',
            trigger: list,
            start: 'top 68%',
            end: 'bottom 72%',
          }),
        );
      }

      cleanups.push(trackActiveItem(entries, onActive, { start: 'top 60%', end: 'bottom 40%' }));

      return () => cleanups.forEach((c) => c());
    }, section);

    return () => ctx.revert();
  }, [onActive]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      /* No `px-*` here: `.measure` already applies the sitewide gutter, and
         stacking a second one cost 32px of every 390px screen. */
      className="relative py-16 md:py-24"
      aria-labelledby="experience-heading"
    >
      <div className="measure">
        <SectionHead
          index="03"
          label="Career"
          id="experience-heading"
          title="Selected Experience."
          lede="Building modern digital products across software engineering, product development, cloud, and cybersecurity—with a focus on performance, scalability, clean architecture, and continuous learning."
          className="mb-12 md:mb-16"
        />

        <div ref={listRef} className="relative">
          {/* The spine: a resting hairline with an accent segment filling it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-[hsl(var(--foreground)_/0.14)]"
          />
          <span
            ref={spineRef}
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 top-0 w-px origin-top bg-[hsl(var(--primary))]"
            style={{ transform: 'scaleY(0)' }}
          />

          {experiences.map((exp, i) => {
            const isActive = i === active;
            return (
              <article
                key={exp.id}
                data-entry
                className="group relative py-10 pl-6 sm:pl-10"
              >
                {/* Marker on the spine — fills when the reader reaches it. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute left-0 top-[3.1rem] h-[7px] w-[7px] -translate-x-1/2 transition-[background-color,transform] duration-300 ease-[var(--ease-spring-2)] ${
                    isActive
                      ? 'scale-125 bg-[hsl(var(--primary))]'
                      : 'scale-100 bg-[hsl(var(--foreground)_/0.28)]'
                  }`}
                />

                <div
                  data-line
                  className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <h3 className="text-2xl font-bold tracking-tight text-[hsl(var(--foreground)_/0.82)] transition-colors duration-300 ease-[var(--ease-spring-2)] group-hover:text-[hsl(var(--foreground))] sm:text-3xl">
                    {exp.role}
                  </h3>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground)_/0.6)] sm:text-right">
                    {exp.duration}
                  </span>
                </div>

                <p
                  data-line
                  className={`mt-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-300 ${
                    isActive
                      ? 'text-[hsl(var(--primary-ink,var(--primary)))]'
                      : 'text-[hsl(var(--primary-ink,var(--primary))_/0.7)]'
                  }`}
                >
                  {exp.company}
                </p>

                <p
                  data-line
                  className="mt-4 max-w-2xl text-sm leading-relaxed text-[hsl(var(--muted-foreground)_/0.8)] sm:text-base"
                >
                  {exp.description}
                </p>

                <ul className="mt-5 flex flex-col gap-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li
                      key={idx}
                      data-line
                      className="flex items-start gap-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground)_/0.7)]"
                    >
                      {/* The tick extends on hover. `scaleX`, not `width` —
                          the visual result is identical and the browser never
                          relayouts the line of text beside it. */}
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-px w-5 shrink-0 origin-left scale-x-[0.6] bg-[hsl(var(--muted-foreground)_/0.4)] transition-[transform,background-color] duration-300 ease-[var(--ease-spring-2)] group-hover:scale-x-100 group-hover:bg-[hsl(var(--primary)_/0.7)]"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <span
                  data-entry-rule
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[hsl(var(--foreground)_/0.14)]"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
