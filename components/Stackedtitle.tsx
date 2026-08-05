'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

type StackedTitleProps = {
  /** First word — rendered in the foreground color */
  first: string;
  /** Second word — rendered in the primary/accent color */
  second: string;
  /** Passed to the real heading so `aria-labelledby` elsewhere can target it */
  id?: string;
  /** Heading level for the one real, accessible instance. Defaults to h2. */
  as?: 'h1' | 'h2' | 'h3';
  /** Opacity of each decorative echo, listed top (faintest) to bottom (closest to solid) */
  echoOpacities?: number[];
  /** Override the responsive size clamp — bigger for a page hero, smaller for a section marker */
  sizeClassName?: string;
  className?: string;
  /**
   * Scroll-linked drift. Deeper echoes travel further, so the stack fans open
   * and closes as the title passes the viewport. Off by default, because a
   * title used inside an already-pinned section should not also move.
   */
  parallax?: boolean;
};

const DEFAULT_ECHO_OPACITIES = [0.05, 0.12, 0.24, 0.4];
const DEFAULT_SIZE_CLASS = 'text-[clamp(2.25rem,10vw,5rem)]';

/**
 * Stacked "echo" title — repeats the words as hollow, fading duplicates
 * stacked tightly above one solid instance. Only the last line is real
 * content; everything above it is `aria-hidden` decoration, so screen
 * readers and search engines only ever see the word once.
 *
 * Motion is owned here rather than by the parent. The echoes used to carry
 * `data-reveal`, which handed them to whatever GSAP reveal the parent section
 * ran — and that reveal sets `opacity: 1`, flattening the deliberate 0.05 → 0.4
 * gradient the stack is built from. Each echo now animates itself: a wrapper
 * element owns the entrance (rise + fade) and the inner element owns the
 * scroll drift, so no two writers ever touch the same transform.
 */
export default function StackedTitle({
  first,
  second,
  id,
  as: Tag = 'h2',
  echoOpacities = DEFAULT_ECHO_OPACITIES,
  sizeClassName = DEFAULT_SIZE_CLASS,
  className = '',
  parallax = false,
}: StackedTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const drift = parallax && !reduce;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const sizeClasses = `font-sans font-black uppercase leading-[0.78] tracking-tight ${sizeClassName}`;
  const count = echoOpacities.length;

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Decorative echoes — hollow duplicates fading in from above, ignored by assistive tech */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        {echoOpacities.map((opacity, i) => (
          <motion.div
            key={i}
            initial={reduce ? undefined : { y: 26, opacity: 0 }}
            whileInView={reduce ? undefined : { y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Echo
              first={first}
              second={second}
              opacity={opacity}
              depth={count - i}
              progress={scrollYProgress}
              drift={drift}
              className={sizeClasses}
            />
          </motion.div>
        ))}
      </div>

      {/* The real heading — the single instance that's actually in the a11y tree */}
      <motion.div
        initial={reduce ? undefined : { y: 30, opacity: 0 }}
        whileInView={reduce ? undefined : { y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.6, delay: count * 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <Tag id={id} className={sizeClasses}>
          <span className="text-[hsl(var(--foreground))]">{first}</span>{' '}
          <span className="text-[hsl(var(--primary))]">{second}</span>
        </Tag>
      </motion.div>
    </div>
  );
}

function Echo({
  first,
  second,
  opacity,
  depth,
  progress,
  drift,
  className,
}: {
  first: string;
  second: string;
  opacity: number;
  depth: number;
  progress: MotionValue<number>;
  drift: boolean;
  className: string;
}) {
  // Deeper (fainter, higher) echoes travel further — the stack fans open.
  const y = useTransform(progress, [0, 1], [depth * 12, depth * -12]);

  return (
    <motion.p data-echo style={drift ? { opacity, y } : { opacity }} className={className}>
      <span
        className="text-transparent"
        style={{ WebkitTextStroke: '1.5px hsl(var(--foreground))' }}
      >
        {first}
      </span>{' '}
      <span
        className="text-transparent"
        style={{ WebkitTextStroke: '1.5px hsl(var(--primary))' }}
      >
        {second}
      </span>
    </motion.p>
  );
}
