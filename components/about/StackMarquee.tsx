'use client';

import {
  motion,
  wrap,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useRef, useState } from 'react';

interface MarqueeRowProps {
  items: string[];
  /** -1 runs right-to-left, 1 runs left-to-right. */
  direction?: 1 | -1;
  /** Percent of the track travelled per second at rest. */
  speed?: number;
  /** Painted in the accent instead of the muted rule treatment. */
  emphasise?: boolean;
}

/**
 * One marquee row.
 *
 * Position is a single motion value written by one `useAnimationFrame` loop,
 * so nothing else can fight it. Scroll velocity feeds into that loop: flick the
 * page and the row surges; stop and it settles back to its resting speed. The
 * direction also flips with the scroll direction, which is the detail that
 * makes it read as *reacting* to the visitor rather than looping at them.
 */
function MarqueeRow({ items, direction = -1, speed = 2.2, emphasise = false }: MarqueeRowProps) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const [paused, setPaused] = useState(false);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1600, 0, 1600], [-4, 0, 4], {
    clamp: true,
  });

  // Two copies of the list sit side by side, so wrapping at -50% is seamless.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionRef = useRef<number>(direction);

  useAnimationFrame((_t, delta) => {
    if (reduce || paused) return;
    // The row renders `items` twice, so wrapping at -50% is exactly one list
    // and `speed` reads as "percent of the doubled track per second".
    let moveBy = directionRef.current * speed * (delta / 1000);

    const v = velocityFactor.get();
    if (v < 0) directionRef.current = -1;
    else if (v > 0) directionRef.current = 1;
    moveBy += directionRef.current * moveBy * Math.abs(v);

    baseX.set(baseX.get() + moveBy);
  });

  const doubled = [...items, ...items];

  return (
    <div
      className="flex overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex shrink-0 flex-nowrap"
        style={reduce ? undefined : { x }}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`micro shrink-0 whitespace-nowrap px-5 py-4 ${
              emphasise ? 'micro--accent' : 'micro--strong'
            }`}
          >
            <span
              aria-hidden="true"
              className="inline-block h-1 w-1 bg-[hsl(var(--primary))]"
            />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface StackMarqueeProps {
  items: string[];
  label?: string;
}

/**
 * Two counter-running rows straddling a hairline — the full-bleed band that
 * breaks the page's column and lets the eye rest. The list is also emitted once
 * as a plain, visually-hidden list so assistive tech reads the stack in order
 * instead of the duplicated marquee track.
 */
export default function StackMarquee({ items, label = 'Stack' }: StackMarqueeProps) {
  const reduce = useReducedMotion();
  const reversed = [...items].reverse();

  return (
    <section className="bleed-t bleed-b relative overflow-hidden py-5" aria-label={label}>
      <div className="measure mb-3">
        <span className="micro">{label}</span>
      </div>

      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <MarqueeRow items={items} direction={-1} speed={2.4} emphasise />
      <div className="my-1 h-px w-full bg-[var(--rule-color)]" aria-hidden="true" />
      <MarqueeRow items={reversed} direction={1} speed={1.7} />

      {reduce ? null : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28"
          style={{
            background:
              'linear-gradient(to right, hsl(var(--background)), hsl(var(--background) / 0))',
          }}
        />
      )}
      {reduce ? null : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28"
          style={{
            background:
              'linear-gradient(to left, hsl(var(--background)), hsl(var(--background) / 0))',
          }}
        />
      )}
    </section>
  );
}
