'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useRef } from 'react';

const STATEMENT =
  'Nothing here is a mockup. Every one of these shipped, went into daily use, and had to keep working long after launch.';

const ACCENT = new Set(['shipped', 'daily', 'working']);

const SPEC = ['Solo build, front to back', 'Shipped, not shelved', 'Still in use'];

/**
 * The closing statement of /projects — the sibling of
 * `components/about/Manifesto`.
 *
 * A tall runway holds a `position: sticky` stage. As the runway passes, each
 * word is lit in turn: the sentence assembles itself out of the dark at exactly
 * the pace the visitor scrolls, and un-assembles if they scroll back. Once the
 * last word is lit, the spec band underneath fades up — the payoff for having
 * read the whole line rather than a decoration that was always there.
 *
 * Scroll-linked, never hijacked. The stage is sticky, so the document scrolls
 * normally the entire time and the section can be scrolled, tabbed or skipped
 * past like any other.
 */
export default function WorkNote() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const words = STATEMENT.split(' ');

  const ruleScale = useTransform(scrollYProgress, [0.08, 0.82], [0, 1]);
  const indexOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const counter = useTransform(scrollYProgress, [0.08, 0.82], [0, words.length]);
  const specOpacity = useTransform(scrollYProgress, [0.84, 0.95], [0, 1]);

  return (
    <section aria-labelledby="worknote-heading" className="relative">
      <h2 id="worknote-heading" className="sr-only">
        What ships
      </h2>

      <div ref={runwayRef} className={reduce ? 'relative' : 'relative h-[240dvh] md:h-[300dvh]'}>
        <div
          className={
            reduce
              ? 'relative flex items-center py-20'
              : 'sticky top-0 flex h-[100dvh] items-center overflow-hidden'
          }
        >
          <div className="measure w-full">
            <motion.div
              aria-hidden="true"
              className="mb-8 flex items-baseline justify-between gap-4"
              style={reduce ? undefined : { opacity: indexOpacity }}
            >
              <span className="micro micro--accent">04 — Working note</span>
              <WordCounter counter={counter} total={words.length} reduce={!!reduce} />
            </motion.div>

            <p className="max-w-[18ch] text-[clamp(1.75rem,6vw,4rem)] font-black uppercase leading-[0.94] tracking-[-0.03em] sm:max-w-[22ch]">
              {words.map((word, i) => (
                <Word
                  key={`${word}-${i}`}
                  word={word}
                  index={i}
                  total={words.length}
                  progress={scrollYProgress}
                  reduce={!!reduce}
                />
              ))}
            </p>

            <motion.div
              aria-hidden="true"
              className="mt-10 h-px w-full origin-left bg-[hsl(var(--primary))]"
              style={reduce ? undefined : { scaleX: ruleScale }}
            />

            {/* The band the statement is evidence for. Held back until the
                sentence has finished assembling. */}
            <motion.div
              className="spec-bar mt-6 border-t-0 px-0"
              style={reduce ? undefined : { opacity: specOpacity }}
            >
              {SPEC.map((item, i) => (
                <span key={item} className={i === SPEC.length - 1 ? 'micro micro--accent' : 'micro'}>
                  {i === SPEC.length - 1 ? (
                    <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-[hsl(var(--primary))]" />
                  ) : null}
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** One word, lit by scroll position. */
function Word({
  word,
  index,
  total,
  progress,
  reduce,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // Words light between 8% and 82% of the runway; each gets a slice, with a
  // deliberate overlap so the sentence flows rather than ticks.
  const span = (0.82 - 0.08) / total;
  const start = 0.08 + index * span;
  const end = start + span * 1.9;

  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const y = useTransform(progress, [start, end], [6, 0]);
  const accent = ACCENT.has(word.replace(/[^\p{L}]/gu, '').toLowerCase());

  return (
    <>
      <motion.span
        className={`inline-block ${accent ? 'accent' : 'text-[hsl(var(--foreground))]'}`}
        style={reduce ? undefined : { opacity, y }}
      >
        {word}
      </motion.span>{' '}
    </>
  );
}

/** Live "07 / 22" readout — makes the pin legible as progress, not a freeze. */
function WordCounter({
  counter,
  total,
  reduce,
}: {
  counter: MotionValue<number>;
  total: number;
  reduce: boolean;
}) {
  const rounded = useTransform(counter, (v) =>
    String(Math.min(total, Math.max(0, Math.round(v)))).padStart(2, '0'),
  );

  if (reduce) {
    return (
      <span className="micro">
        {String(total).padStart(2, '0')} / {total}
      </span>
    );
  }

  return (
    <span className="micro" aria-hidden="true">
      <motion.span>{rounded}</motion.span> / {String(total).padStart(2, '0')}
    </span>
  );
}
