'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/lib/data';
import { trackProjectView } from '@/lib/utils';
import {
  drawIn,
  gsap,
  parallax,
  refreshTriggersWhenSettled,
  revealOnScroll,
  scrubScale,
  trackActiveItem,
  useIsoLayoutEffect,
  useReducedMotion,
} from '@/lib/motion';
import Magnetic from '@/components/motion/Magnetic';
import { useSectionIntro } from '@/components/motion/useSectionIntro';
import SectionHead from '@/components/SectionHead';

/**
 * Selected work — the section that carries the scroll story.
 *
 * Above `lg` the list sits beside a **sticky plate**: one image frame that
 * stays put while the rows scroll past it, cross-fading to whichever project
 * is currently under the reader's eye and parallaxing its picture against the
 * scroll. Reading the list becomes a sequence rather than a scan, which is the
 * whole point — and hovering any row promotes that project to the plate
 * immediately, so pointer intent overrides scroll position.
 *
 * Below `lg` the plate is not rendered at all. A sticky image column in a
 * single-column layout is either a pinned section (which fights momentum
 * scrolling on touch and needs a spacer element that breaks the hairline grid)
 * or a header that eats half the viewport. The rows carry their own compact
 * thumbnail instead and the flow stays stacked — the graceful degradation the
 * brief asks for, chosen at the layout level rather than patched at runtime.
 */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);

  // Which project the plate is showing. Driven by scroll position, overridden
  // by hover. Starts at 0 so the plate is never empty on first paint.
  const [active, setActive] = useState(0);
  // The scroll-derived index, kept separately so releasing a hover falls back
  // to wherever the reader actually is rather than to whatever they hovered.
  const scrollIndex = useRef(0);

  useSectionIntro(sectionRef);

  const setFromScroll = useCallback((i: number) => {
    scrollIndex.current = i;
    setActive(i);
  }, []);

  // ── Row reveals + the sticky plate's scroll behaviour ────────────────────
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];
      const rows = gsap.utils.toArray<HTMLElement>('[data-row]', list);

      // Rows arrive as one staggered run rather than four separate events.
      cleanups.push(
        revealOnScroll(rows, { y: 28, duration: 0.66, stagger: 0.09, start: 'top 90%' }),
      );

      // Each row's hairline strokes itself in from the left, a beat behind the
      // row it belongs to.
      cleanups.push(
        drawIn('[data-row-rule]', { duration: 0.7, stagger: 0.09, delay: 0.12, start: 'top 92%' }),
      );

      // Which project is "current" — this is what the plate follows.
      cleanups.push(trackActiveItem(rows, setFromScroll, { start: 'top 62%', end: 'bottom 38%' }));

      // Progress through the list, scrubbed. Transform-only, so growing it
      // never costs a layout pass.
      if (meterRef.current) {
        cleanups.push(
          scrubScale(meterRef.current, {
            axis: 'x',
            trigger: list,
            start: 'top 70%',
            end: 'bottom 60%',
          }),
        );
      }

      // The plate's picture drifts against the scroll. Only the layer inside
      // the frame moves; the frame itself is `position: sticky` and must not
      // be transformed, or it stops sticking.
      cleanups.push(
        parallax('[data-plate-layer]', { distance: 12, trigger: list, start: 'top bottom', end: 'bottom top' }),
      );

      return () => cleanups.forEach((c) => c());
    }, section);

    refreshTriggersWhenSettled();
    return () => ctx.revert();
  }, [setFromScroll]);

  // Hover promotes a project to the plate; leaving hands it back to scroll.
  // Pointer-driven only — a touch "hover" is a tap on its way to a navigation,
  // and repainting the plate underneath it is noise.
  const [pointerFine, setPointerFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const on = () => setPointerFine(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const onRowEnter = (i: number) => () => {
    if (pointerFine) setActive(i);
  };
  const onListLeave = () => {
    if (pointerFine) setActive(scrollIndex.current);
  };

  const current = projects[active] ?? projects[0];
  // Read through the hook, not the bare matchMedia call: the server always
  // renders `false`, so branching on the raw query during render would make
  // the first client render disagree with the server HTML.
  const reduce = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="overflow-x-clip pt-16 pb-6 md:pt-24"
      aria-labelledby="projects-heading"
    >
      {/* ONE container for the whole section, and it is `.measure` — the same
          column every other section on /projects (and on /about) is set in, so
          the page has a single left edge from the hero down to the footer. */}
      <div className="measure relative">
        <SectionHead
          index="02"
          label="Index"
          id="projects-heading"
          title="Selected projects."
          lede="Four products, built end-to-end and still in use. Each row opens the full case study."
          className="mb-6"
        />

        {/* No `items-start` on this grid. Grid items default to `stretch`, and
            that is load-bearing here: a `position: sticky` element can only
            travel inside its containing block, so if the aside shrink-wrapped
            its own content the plate would unstick the moment its column
            ended — roughly 40px of travel instead of the length of the list. */}
        <div className="mt-10 grid gap-[var(--gutter)] lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          {/* ── The sticky plate (lg and up) ── */}
          <aside className="hidden lg:block" aria-hidden="true">
            <div className="sticky top-28">
              <div
                ref={plateRef}
                className="crop-frame relative aspect-[4/3] w-full overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--background-light))]"
              >
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    className="absolute inset-0"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transition: reduce
                        ? 'none'
                        : 'opacity 420ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                  >
                    {/* The moving layer. Oversized so its travel never drags an
                        edge into frame. */}
                    <div data-plate-layer className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
                      <Image
                        src={project.thumbnail}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 420px, 0px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
                {/* Registration marks — the frame reads as a plate on a press
                    sheet, not as a card. */}
                <span className="crop crop--tl" />
                <span className="crop crop--tr" />
                <span className="crop crop--bl" />
                <span className="crop crop--br" />
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-[hsl(var(--border))] pt-3">
                <span className="micro micro--strong tabular-nums">{current.number}</span>
                <span className="micro truncate">{current.title}</span>
              </div>

              <p className="micro mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {current.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="whitespace-nowrap">
                    {tech}
                  </span>
                ))}
              </p>

              {/* Reading progress through the list. */}
              <div className="relative mt-5 h-px w-full bg-[hsl(var(--foreground)_/0.14)]">
                <span
                  ref={meterRef}
                  className="absolute inset-0 origin-left bg-[hsl(var(--primary))]"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
            </div>
          </aside>

          {/* ── The list ── */}
          <ul ref={listRef} onPointerLeave={onListLeave} className="flex flex-col">
            {projects.map((project, i) => {
              const isActive = i === active;
              return (
                <li key={project.id} className="project-row relative">
                  <Link
                    data-row
                    href={`/projects/${project.slug}`}
                    onClick={() => trackProjectView(project.slug)}
                    onPointerEnter={onRowEnter(i)}
                    onFocus={() => setActive(i)}
                    aria-label={`View ${project.title} case study`}
                    className="group relative grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-4 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)_/0.6)] md:gap-6 md:py-9"
                  >
                    <span
                      className={`font-mono text-xs font-semibold uppercase tracking-[0.1em] transition-colors duration-200 ${
                        isActive
                          ? 'text-[hsl(var(--primary-ink,var(--primary)))]'
                          : 'text-[hsl(var(--muted-foreground)_/0.6)]'
                      }`}
                    >
                      {project.number}
                    </span>

                    <div className="min-w-0">
                      {/* Geist Sans, like everything else on the site. */}
                      <h3
                        className="font-sans text-lg font-semibold text-[hsl(var(--foreground)_/0.85)] transition-[color,transform] duration-300 ease-[var(--ease-spring-2)] group-hover:translate-x-1 group-hover:text-[hsl(var(--foreground))] md:text-xl"
                      >
                        {project.title}
                      </h3>
                      {/* Wrapping flex items rather than a " · "-joined string:
                          a joined string wraps wherever it likes and strands the
                          separator at the end of a line. Each token is its own
                          nowrap box and the gap does the separating. */}
                      <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.65rem] uppercase leading-tight tracking-[0.12em] text-[hsl(var(--muted-foreground)_/0.55)]">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span key={tech} className="whitespace-nowrap">
                            {tech}
                          </span>
                        ))}
                      </p>
                    </div>

                    {/* Compact plate for the widths where the sticky one is not
                        rendered, so the list is never text-only. */}
                    <span
                      aria-hidden="true"
                      className="relative block h-12 w-[4.5rem] shrink-0 overflow-hidden border border-[hsl(var(--border))] lg:hidden"
                    >
                      <Image
                        src={project.thumbnail}
                        alt=""
                        fill
                        sizes="72px"
                        className={`object-cover object-top transition-transform duration-500 ease-[var(--ease-spring-2)] ${
                          isActive ? 'scale-105' : 'scale-100'
                        }`}
                      />
                    </span>

                    {/* The `hidden lg:block` lives on this wrapper, not on the
                        <Magnetic> itself: Magnetic writes `display:
                        inline-block` as an inline style, and an inline style
                        beats a class — so `hidden` did nothing and the arrow
                        appeared on mobile as a fourth item in a three-column
                        grid, wrapping onto a row of its own under every
                        thumbnail. */}
                    <span className="hidden shrink-0 pl-3 lg:block">
                      <Magnetic as="span" strength={0.3} radius={50}>
                        <span className="text-xl leading-none text-[hsl(var(--muted-foreground)_/0.6)] transition-[color,transform] duration-300 ease-[var(--ease-spring-2)] group-hover:translate-x-1 group-hover:text-[hsl(var(--primary-ink,var(--primary)))]">
                          →
                        </span>
                      </Magnetic>
                    </span>

                    {/* The row's own hairline. Two rules stacked: the resting
                        grey one, and an accent one that wipes across it on
                        hover — scaleX, so it costs a composite and nothing
                        more. */}
                    <span
                      data-row-rule
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[hsl(var(--foreground)_/0.14)]"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[hsl(var(--primary))] transition-transform duration-[400ms] ease-[var(--ease-spring-2)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
