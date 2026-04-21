'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  phrases: string[];
  className?: string;
}

export default function TypingText({ phrases, className = '' }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase]         = useState<'typing' | 'pausing' | 'deleting'>('typing');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);

  useEffect(() => {
    const current = phrases[phraseIdx];

    if (phase === 'typing') {
      if (charIdx < current.length) {
        timerRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, 55 + Math.random() * 30);
      } else {
        timerRef.current = setTimeout(() => setPhase('pausing'), 1800);
      }
    } else if (phase === 'pausing') {
      timerRef.current = setTimeout(() => setPhase('deleting'), 400);
    } else {
      if (charIdx > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, 28);
      } else {
        setPhraseIdx(p => (p + 1) % phrases.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, charIdx, phraseIdx, phrases]);

  return (
    <span className={className}>
      {displayed}
      <span
        className="inline-block w-[2px] h-[1em] ml-0.5 align-middle animate-pulse"
        style={{ backgroundColor: 'hsl(var(--primary))', verticalAlign: 'text-bottom' }}
        aria-hidden="true"
      />
    </span>
  );
}
