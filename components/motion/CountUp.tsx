'use client';

import { useEffect, useRef, useState } from 'react';
import { countUp } from '@/lib/motion';

interface Props {
  /** The real figure. Anything non-finite renders as `placeholder`. */
  value: number | null | undefined;
  /** Shown when `value` isn't a number yet — a live figure that hasn't landed. */
  placeholder?: string;
  /** Seconds. Kept short: a number the eye has to wait for reads as loading. */
  duration?: number;
  className?: string;
  /** Formats every intermediate frame. Defaults to thousands separators. */
  format?: (n: number) => string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString();

/**
 * A figure that counts up when it scrolls into view.
 *
 * Three things this has to get right, all of which the naive version gets
 * wrong:
 *
 *  · **It must never lie about the number.** The tween writes through a
 *    formatter and then hard-sets the exact final value on completion, so
 *    rounding during the climb can't leave "1,283" on screen forever.
 *  · **It must not reflow the layout on every frame.** The digits are
 *    `tabular-nums` and the box reserves the final string's width, so a count
 *    from 0 to 1,284 doesn't shove the label next to it around 60 times a
 *    second. That is done by rendering the final value invisibly underneath
 *    the animating one, which is also what makes it copy-pasteable and
 *    readable to a screen reader.
 *  · **It must survive not animating.** Reduced motion, a backgrounded tab, a
 *    dead ScrollTrigger — the real figure is in the DOM from the first render
 *    and the animation only ever overlays it.
 */
export default function CountUp({
  value,
  placeholder = '—',
  duration = 1.1,
  className = '',
  format = defaultFormat,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const numeric = typeof value === 'number' && Number.isFinite(value);
  const finalText = numeric ? format(value as number) : placeholder;

  // Seeded with the final text, not with zero: if the effect below never runs
  // the visitor still reads the correct number.
  const [display, setDisplay] = useState(finalText);

  useEffect(() => {
    const el = ref.current;
    if (!el || !numeric) {
      setDisplay(finalText);
      return;
    }
    return countUp(el, value as number, {
      duration,
      start: 'top 90%',
      onUpdate: (v) => setDisplay(format(v)),
    });
    // `format` is a prop that callers usually pass inline; depending on its
    // identity would restart the count on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, numeric, duration, finalText]);

  return (
    <span ref={ref} className={`relative inline-block tabular-nums ${className}`}>
      {/* Reserves the final width so nothing beside it moves while it climbs. */}
      <span aria-hidden="true" className="invisible">
        {finalText}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
