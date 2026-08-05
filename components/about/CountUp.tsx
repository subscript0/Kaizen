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

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

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
