'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#$%&*';

interface Props {
  text: string;
  className?: string;
  as?: ElementType;
  /** Frames of scramble before settling (higher = longer decode). */
  frames?: number;
}

/**
 * Decodes `text` from random characters when scrolled into view — once.
 * Great for DM Mono eyebrows/labels. Reduced-motion: shows text immediately.
 */
export default function ScrambleOnView({ text, className = '', as: Tag = 'span', frames = 22 }: Props) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    const run = () => {
      if (done.current) return;
      done.current = true;
      let frame = 0;
      const iter = () => {
        setDisplay(
          text
            .split('')
            .map((ch, i) => {
              if (ch === ' ') return ' ';
              if (i < Math.floor((frame / frames) * text.length)) return ch;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        frame++;
        if (frame <= frames) timer = setTimeout(iter, getFrameDuration());
        else setDisplay(text);
      };
      iter();
    };

    const st = ScrollTrigger.create({ trigger: el, start: 'top 88%', onEnter: run });
    return () => { st.kill(); if (timer) clearTimeout(timer); };
  }, [text, frames]);

  // Get frame duration from CSS variable (60fps baseline, adjusted for motion design timing)
  const getFrameDuration = () => {
    if (typeof window === 'undefined') return 38; // fallback
    const baseMs = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--duration-base')?.replace('ms', '') || '200');
    // Convert base duration to frame duration (assuming ~60fps for smooth animation)
    return Math.max(16, Math.round(baseMs / 6)); // ~33ms for 200ms base, clamped to min 16ms (60fps)
  };

  return <Tag ref={ref} className={className}>{display}</Tag>;
}