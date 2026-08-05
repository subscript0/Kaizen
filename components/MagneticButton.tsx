'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

/**
 * Magnetic button component that follows the cursor with motion design principles.
 * Uses reduced motion preferences and follows the 4px grid system.
 */
export default function MagneticButton({ children, className = '', href, onClick, strength = 0.35 }: Props) {
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Only on non-touch devices and respect reduced motion preference
    if (window.matchMedia('(hover: none)').matches || reduceMotion) return;

    const el = btnRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * strength;
      const dy   = (e.clientY - cy) * strength;

      // Use motion design timing function for smooth movement
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    };

    const onLeave = () => {
      // Spring-back motion using motion design easing
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)';
    };

    const onEnter = () => {
      el.style.transition = 'transform 0.1s ease-out';
    };

    el.addEventListener('mousemove',  onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength, reduceMotion]);

  const baseClass = `inline-flex items-center justify-center rounded-xl border border-transparent
                     transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                     hover:border-primary/50 hover:bg-primary/5
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                     disabled:opacity-50 disabled:pointer-events-none
                     ${className}`;

  const props = { ref: btnRef, className: baseClass, onClick };

  if (href) {
    return <a {...props} href={href}>{children}</a>;
  }
  return <button {...props}>{children}</button>;
}