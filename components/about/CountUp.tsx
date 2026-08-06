'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  /** Rendered after the number — "+", "K+", "%". Kept out of the animation. */
  suffix?: string;
  /** Seconds. Longer than a UI transition on purpose: the count IS the content. */
  duration?: number;
  className?: string;
}

/**
 * A number that counts up the first time it scrolls into view.
 *
 * `tabular-nums` matters more than the animation: without it the glyph widths
 * change on every frame and the whole row of stats jitters sideways while
 * counting. The accessible value is announced once, in full, via the sr-only
 * span — screen readers never hear a stream of intermediate numbers.
 */
export default function CountUp({ to, suffix = '', duration = 1.5, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -18% 0px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  // ── Why this does not just gate on `inView` ────────────────────────────────
  //
  // The initial value is 0, so a figure that never starts reads as a factual
  // claim: "0 products shipped", "0 years building". That was survivable while
  // every ledger sat below a 290dvh hero and could only be reached by scrolling
  // — the scroll itself guaranteed the observer had fired. Removing those heroes
  // put the ledgers on the FIRST screen, where the number has to be right before
  // the visitor touches anything, and where an observer that hasn't reported yet
  // is visible as a wrong number rather than as a missing animation.
  //
  // So the trigger is "in view according to the observer, OR measurably inside
  // the viewport right now". The geometry check runs once on mount and settles
  // exactly the above-the-fold case; everything further down still waits for the
  // observer, and still counts on the way in.
  useEffect(() => {
    if (started) return;
    if (inView) {
      setStarted(true);
      return;
    }
    const el = ref.current;
    if (el && el.getBoundingClientRect().top < window.innerHeight) setStarted(true);
  }, [inView, started]);

  useEffect(() => {
    // Reduced motion is settled first: there is no animation to defer in that
    // branch, so it should never wait on a trigger at all.
    if (reduce) {
      setValue(to);
      return;
    }
    if (!started) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [started, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {value}
        {suffix}
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}
