'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * An SVG accent that draws itself (stroke-dashoffset) when scrolled into view.
 * Drop under a heading: <span className="relative">Heading<LineDraw/></span>
 * Uses motion design timing functions and respects reduced motion preferences.
 */
export default function LineDraw({
  className = '',
  color = 'hsl(var(--primary))',
  weight = 4,
  variant = 'underline',
  delay = 0,
}: {
  className?: string;
  color?: string;
  weight?: number;
  variant?: 'underline' | 'squiggle';
  delay?: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const reduceMotion = useReducedMotion();

  const d =
    variant === 'squiggle'
      ? 'M2 10 Q 40 2, 80 10 T 158 10 T 236 10 T 298 10'
      : 'M2 9 C 70 2, 150 2, 298 8';

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    if (reduceMotion) {
      gsap.set(path, { strokeDashoffset: 0 });
      return;
    }

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.9,
      delay,
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)', // Using motion design ease-spring-1 equivalent
      scrollTrigger: { trigger: path, start: 'top 90%', toggleActions: 'play none none none' },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [delay, reduceMotion]);

  return (
    <svg
      className={className}
      viewBox="0 0 300 14"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
    >
      <path
        ref={pathRef}
        d={d}
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
      />
    </svg>
  );
}