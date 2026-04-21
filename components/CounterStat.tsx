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
    const match = raw.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (!match) return { num: 0, suf: value };
    let num = parseFloat(match[1]);
    let suf = match[2] ?? '';
    if (suf.startsWith('K')) { num *= 1000; suf = suf.replace('K', 'K'); }
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
    const duration = 1400;
    const start    = performance.now();
    const target   = parsed.num;

    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
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
      <p className="text-3xl md:text-4xl font-bold tabular-nums" style={{ color: 'hsl(var(--foreground))' }}>
        {display}
        <span style={{ color: 'hsl(var(--primary))' }}>
          {suffix.replace('K', '')}
        </span>
      </p>
      <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>{label}</p>
    </div>
  );
}
