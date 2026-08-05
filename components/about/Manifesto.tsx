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
  "I don't just build interfaces—I build products that are intuitive, scalable, and designed to solve real problems.";

// Matched after punctuation is stripped, so "scalable," lights as "scalable".
const ACCENT = new Set(['products', 'scalable']);

/**
 * The pinned statement.
 *
 * A tall runway holds a `position: sticky` stage. As the runway passes, each
 * word of the statement is lit in turn — the sentence assembles itself out of
 * the dark at exactly the pace the visitor scrolls, and un-assembles if they
 * scroll back. It is scroll-*linked*, not scroll-*triggered*: the visitor is
 * driving, which is the whole point of a pinned section.
 *
 * No hijack anywhere. The stage is sticky, so the document scrolls normally the
 * entire time and the section can be scrolled past, tabbed past, or skipped.
 */
export default function Manifesto() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const words = STATEMENT.split(' ');

  // The rule under the statement draws itself across as the words light up.
  const ruleScale = useTransform(scrollYProgress, [0.08, 0.86], [0, 1]);
  const indexOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const counter = useTransform(scrollYProgress, [0.08, 0.86], [0, words.length]);

  return (
    <section aria-labelledby="manifesto-heading" className="relative">
      <h2 id="manifesto-heading" className="sr-only">
        Working principle
      </h2>

      <div ref={runwayRef} className={reduce ? 'relative' : 'relative h-[260dvh] md:h-[300dvh]'}>
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
              <span className="micro micro--accent">Working principle</span>
              <WordCounter counter={counter} total={words.length} reduce={!!reduce} />
            </motion.div>

            <p className="max-w-[18ch] text-[clamp(2rem,7.2vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] sm:max-w-[22ch]">
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
  // Words light between 8% and 86% of the runway; each gets a slice, with a
  // deliberate overlap so the sentence flows rather than ticks.
  const span = (0.86 - 0.08) / total;
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

/** Live "07 / 19" readout — makes the pin legible as progress, not a freeze. */
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
    return <span className="micro">{String(total).padStart(2, '0')} / {total}</span>;
  }

  return (
    <span className="micro" aria-hidden="true">
      <motion.span>{rounded}</motion.span> / {String(total).padStart(2, '0')}
    </span>
  );
}
