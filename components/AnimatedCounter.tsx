'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({ to, suffix = '', duration = 1800, className = '' }: Props) {
  const [count, setCount]  = useState(0);
  const elRef   = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start     = performance.now();
        const tick      = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease out expo
          const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(Math.floor(eased * to));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(to);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={elRef} className={className}>
      {count}{suffix}
    </span>
  );
}
