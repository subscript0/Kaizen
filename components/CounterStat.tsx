'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;   // e.g. "3+", "10+", "5K+"
  label: string;
  className?: string;
}

export default function CounterStat({ value, label, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [suffix, setSuffix] = useState('');
  const [started, setStarted] = useState(false);

  // Parse "3+" → { num: 3, suffix: '+' }  |  "5K+" → { num: 5000, suffix: 'K+' }
  const parsed = (() => {
    const raw = value.replace(/,/g, '');
    const match = /^(\d+(?:\.\d+)?)(.*)/.exec(raw);
    if (!match) return { num: 0, suf: value };
    let num = parseFloat(match[1]);
    const suf = match[2];

    // Handle suffix multipliers
    if (suf.includes('K')) {
      num *= 1000;
    } else if (suf.includes('M')) {
      num *= 1000000;
    } else if (suf.includes('B')) {
      num *= 1000000000;
    }

    return { num, suf };
  })();

  useEffect(() => {
    setSuffix(parsed.suf);
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [parsed.suf, started]);

  useEffect(() => {
    if (!started) return;

    // Check for reduced motion preference
    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      // For reduced motion, show the final value immediately
      setCount(parsed.num);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const target = parsed.num;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Use motion design easing: ease-spring-3 (gentle ease-out)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(frame);
      else setCount(target);
    };
    requestAnimationFrame(frame);
  }, [started, parsed.num]);

  // Format display: 5000 → "5K"
  const display = (() => {
    if (suffix.startsWith('K')) {
      return count >= 1000 ? `${(count / 1000).toFixed(0)}K` : `${count}`;
    }
    return count.toString();
  })();

  return (
    <div ref={ref} className={className}>
      <p className="text-3xl md:text-4xl font-bold tabular-nums text-foreground/90">
        {display}
        <span className="text-primary/90">
          {suffix.replace('K', '')}
        </span>
      </p>
      <p className="text-sm mt-1 text-muted-foreground/80">{label}</p>
    </div>
  );
}