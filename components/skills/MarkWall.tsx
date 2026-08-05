'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import SectionHead from '@/components/SectionHead';
import TechMark from './TechMark';
import { ALL_TECHS, TOTAL_TECHS, type Tech } from './capabilities';

/**
 * The full set — the pinned section of this page, and the counterpart to the
 * word-by-word statement on /about.
 *
 * Same mechanic, different content. A tall runway holds ONE `position: sticky`
 * stage; as the runway passes, the wall colours in, mark by mark, at exactly
 * the pace the visitor scrolls — and un-colours if they scroll back. Colour is
 * the payoff: an unlit mark is greyscale, a lit one is the real thing. The
 * greyscale here is a transient state on the way to full brand colour, not a
 * palette the page settles on — every mark ends lit.
 *
 * Robust to scroll JUMPS by construction:
 *
 *  - The stage is CSS-sticky inside a runway, not a ScrollTrigger pin. No
 *    injected spacer, no measured pin distance to go stale when a mobile URL
 *    bar resizes the viewport, and momentum scrolling is untouched.
 *  - Every mark's state is a pure `useTransform` of raw scroll progress with no
 *    spring anywhere in the path. Land on any offset — anchor link, scrollbar
 *    drag, restored scroll on reload — and the wall renders the one state that
 *    offset means, rather than animating through the states in between.
 *  - Nothing is absolutely positioned and nothing cross-fades against anything
 *    else, so there is no moment where two things can occupy one slot.
 *
 * Reduced motion collapses the runway to normal flow with every mark already
 * lit; there is no scroll listener and no observer in that path.
 */

/** Where in the runway the first mark starts lighting and the last one finishes. */
const LIGHT_START = 0.06;
const LIGHT_END = 0.84;

export default function MarkWall() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const counter = useTransform(scrollYProgress, [LIGHT_START, LIGHT_END], [0, TOTAL_TECHS]);
  const lit = useTransform(counter, (v) =>
    String(Math.min(TOTAL_TECHS, Math.max(0, Math.round(v)))).padStart(2, '0'),
  );
  const ruleScale = useTransform(scrollYProgress, [LIGHT_START, LIGHT_END], [0, 1]);

  return (
    <section aria-labelledby="full-set-heading" className="relative">
      <div className="measure pb-12 pt-16 md:pb-16 md:pt-24">
        <SectionHead
          index="03"
          label="Full set"
          id="full-set-heading"
          title={
            <>
              {TOTAL_TECHS} tools, <span className="accent">in colour</span>.
            </>
          }
          lede="The whole set on one plate. Keep scrolling and it fills in, one mark at a time — brand colour is the only colour this page spends outside the accent."
        />
      </div>

      <div
        ref={runwayRef}
        className={reduce ? 'relative' : 'relative h-[210dvh] md:h-[250dvh]'}
      >
        <div
          className={
            reduce
              ? 'relative'
              : // The stage. Padded clear of the floating desktop navbar at the
                // top and of the 80px fixed mobile navbar at the bottom.
                'sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pb-[calc(88px+env(safe-area-inset-bottom,0px))] pt-4 md:pb-8 md:pt-[76px]'
          }
        >
          <div className="measure w-full">
            {/* ── Live readout ─────────────────────────────────────────── */}
            <div className="flex items-baseline justify-between gap-4 pb-3">
              <span className="micro micro--ruled">
                <span className="micro--strong">03</span>
                <span>Full set</span>
              </span>

              {reduce ? (
                <span className="micro micro--strong">
                  {TOTAL_TECHS} / {TOTAL_TECHS}
                </span>
              ) : (
                <span className="micro" aria-hidden="true">
                  <motion.span className="micro--strong">{lit}</motion.span>
                  <span>/ {TOTAL_TECHS}</span>
                </span>
              )}
            </div>

            {/* ── The wall ─────────────────────────────────────────────────
                A drawn grid, not a set of cards: every cell carries a hairline
                on two edges and the container closes the other two. */}
            <ul className="rule-t rule-l grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5">
              {ALL_TECHS.map((tech, i) => (
                <MarkCell
                  key={tech.name}
                  tech={tech}
                  index={i}
                  progress={scrollYProgress}
                  reduce={!!reduce}
                />
              ))}
            </ul>

            <motion.div
              aria-hidden="true"
              className="mt-6 h-px w-full origin-left bg-[hsl(var(--primary))]"
              style={reduce ? undefined : { scaleX: ruleScale }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   One cell
   ══════════════════════════════════════════════════════════════════════════ */

function MarkCell({
  tech,
  index,
  progress,
  reduce,
}: {
  tech: Tech;
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // Each mark gets its own slice of the runway, with a deliberate overlap so
  // the wall flows rather than ticks.
  const span = (LIGHT_END - LIGHT_START) / TOTAL_TECHS;
  const start = LIGHT_START + index * span;
  const end = start + span * 2.2;

  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  const grey = useTransform(progress, [start, end], [1, 0]);
  const filter = useMotionTemplate`grayscale(${grey})`;
  const y = useTransform(progress, [start, end], [8, 0]);

  return (
    <li className="rule-b rule-r">
      <motion.div
        className="flex h-full flex-col items-center justify-center gap-2.5 px-2 py-4 md:gap-3 md:py-6"
        style={reduce ? undefined : { opacity, filter, y }}
      >
        <TechMark tech={tech} className="h-7 w-7 md:h-9 md:w-9" />
        <span className="micro block text-center leading-[1.4]">{tech.name}</span>
      </motion.div>
    </li>
  );
}
