'use client';

import { useCallback, useRef, useState } from 'react';
import {
  drawIn,
  gsap,
  revealOnScroll,
  trackActiveItem,
  useIsoLayoutEffect,
  useReducedMotion,
} from '@/lib/motion';
import { useSectionIntro } from '@/components/motion/useSectionIntro';
import SectionHead from '@/components/SectionHead';

const approaches = [
  {
    number: '01',
    title: 'Build with Purpose',
    body: 'Every project begins by understanding the problem before writing code. The goal is to create software that delivers value, not unnecessary complexity.',
  },
  {
    number: '02',
    title: 'Design for Scale',
    body: 'I create reusable components, consistent design systems, and maintainable architectures that allow products to grow without constant rewrites.',
  },
  {
    number: '03',
    title: 'Performance Matters',
    body: 'Fast, responsive applications create better user experiences. I focus on optimization, accessibility, and efficient engineering from the beginning of every project.',
  },
  {
    number: '04',
    title: 'Keep Learning',
    body: 'Technology evolves quickly, and so do I. Every project is an opportunity to learn something new, refine my skills, and become a better engineer.',
  },
];

/**
 * How I think — the sticky-index section.
 *
 * Above `md` the left column stays put while the four principles scroll past
 * it, and the huge index number in it rolls over as each one takes the
 * viewport. The contents list underneath tracks along, so the reader always
 * knows which of four they are in and what is still coming. That is the
 * storytelling device: the page keeps its place for you.
 *
 * ── Why `position: sticky` and not a ScrollTrigger pin ──────────────────────
 * A pin injects a spacer element into the document and takes over the scroll
 * position, which on touch fights momentum scrolling and produces exactly the
 * rubber-banding jank the brief warns about at 390px. CSS sticky is handled by
 * the compositor, costs nothing, and — the part that matters — **the fallback
 * is the layout itself**: below `md` the sticky column is not rendered, the
 * grid collapses to one column, and every entry carries its own index number
 * inline. There is no runtime branch to get wrong, and nothing to unwind.
 */
export default function HowIThink() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useSectionIntro(sectionRef);

  const onActive = useCallback((i: number) => setActive(i), []);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];
      const entries = gsap.utils.toArray<HTMLElement>('[data-entry]', list);

      cleanups.push(
        revealOnScroll('[data-line]', { y: 20, duration: 0.58, stagger: 0.07, start: 'top 88%' }),
      );
      cleanups.push(drawIn('[data-entry-rule]', { duration: 0.75, stagger: 0.1, delay: 0.1 }));
      cleanups.push(trackActiveItem(entries, onActive, { start: 'top 55%', end: 'bottom 45%' }));

      return () => cleanups.forEach((c) => c());
    }, section);

    return () => ctx.revert();
  }, [onActive]);

  const swap = reduce ? 'none' : 'opacity 320ms ease, transform 420ms cubic-bezier(0.25, 0.1, 0.25, 1)';

  return (
    <section
      ref={sectionRef}
      id="approach"
      /* `.measure` supplies the sitewide gutter; a second `px-*` here used to
         take another 32px off every phone screen. */
      className="relative py-16 md:py-24"
      aria-labelledby="approach-heading"
    >
      <div className="measure">
        <SectionHead
          index="02"
          label="Philosophy"
          id="approach-heading"
          title="How I Build."
          lede="Every decision — design through deployment — should make the product easier to use, easier to maintain, easier to scale."
          className="mb-12 md:mb-16"
        />

        {/* Grid items stay at their default `stretch`. The sticky index can
            only travel inside its own column, so shrink-wrapping that column
            to its content would unstick it immediately. */}
        <div className="grid gap-[var(--gutter)] md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
          {/* ── Sticky index (md and up) ── */}
          <aside className="hidden md:block">
            <div className="sticky top-32">
              {/* The number rolls: the outgoing digit lifts out of the frame
                  while the incoming one rises into it. One clipped box, four
                  stacked layers, transform and opacity only. */}
              <div
                aria-hidden="true"
                className="relative h-[4.5rem] overflow-hidden lg:h-[5.5rem]"
              >
                {approaches.map((item, i) => (
                  <span
                    key={item.number}
                    /* `--primary-ink`, not `--primary`. This is type, and the
                       fill token is the raw yellow — which on the light theme
                       sits at about 1.5:1 against the paper. The ink token is
                       the darkened variant the palette keeps for exactly this. */
                    className="absolute inset-0 font-mono text-[4rem] font-black leading-none tracking-tight text-[hsl(var(--primary-ink,var(--primary)))] lg:text-[5rem]"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform:
                        i === active
                          ? 'translateY(0)'
                          : `translateY(${i < active ? '-42%' : '42%'})`,
                      transition: swap,
                    }}
                  >
                    {item.number}
                  </span>
                ))}
              </div>

              {/* Contents. Tells the reader where they are and what is left. */}
              <ol className="mt-6 border-t border-[hsl(var(--foreground)_/0.14)] pt-4">
                {approaches.map((item, i) => {
                  const isActive = i === active;
                  return (
                    <li key={item.number} className="flex items-baseline gap-3 py-1.5">
                      <span
                        aria-hidden="true"
                        className={`mt-[0.55em] h-px w-4 shrink-0 origin-left transition-[transform,background-color] duration-300 ease-[var(--ease-spring-2)] ${
                          isActive
                            ? 'scale-x-100 bg-[hsl(var(--primary))]'
                            : 'scale-x-[0.45] bg-[hsl(var(--foreground)_/0.28)]'
                        }`}
                      />
                      <span
                        className={`micro transition-colors duration-300 ${
                          isActive ? '!text-[hsl(var(--foreground))]' : ''
                        }`}
                      >
                        {item.title}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* ── The principles ── */}
          <div ref={listRef} className="border-t border-[hsl(var(--foreground)_/0.14)] md:border-t-0">
            {approaches.map((item, i) => {
              const isActive = i === active;
              return (
                <article
                  key={item.number}
                  data-entry
                  className="group relative grid grid-cols-[3.5rem_1fr] items-start gap-4 py-10 sm:gap-8 md:grid-cols-1 md:py-14 lg:py-16"
                >
                  {/* Inline index — the fallback for the sticky column, which
                      is not rendered below `md`. */}
                  <span
                    aria-hidden="true"
                    className="font-mono text-4xl font-black leading-none text-[hsl(var(--foreground)_/0.12)] transition-colors duration-300 ease-[var(--ease-spring-2)] group-hover:text-[hsl(var(--primary)_/0.4)] md:hidden"
                  >
                    {item.number}
                  </span>

                  <div>
                    <h3
                      data-line
                      className={`text-xl font-bold tracking-tight transition-colors duration-300 ease-[var(--ease-spring-2)] sm:text-2xl md:text-3xl ${
                        isActive
                          ? 'text-[hsl(var(--foreground))]'
                          : 'text-[hsl(var(--foreground)_/0.8)]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      data-line
                      className="mt-3 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground)_/0.82)] sm:text-base md:mt-4"
                    >
                      {item.body}
                    </p>
                  </div>

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
      </div>
    </section>
  );
}
