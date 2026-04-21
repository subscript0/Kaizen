'use client';

import { useEffect, useRef, useState, ElementType } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

interface Props {
  text: string;
  className?: string;
  trigger?: boolean;
  as?: ElementType;
  delay?: number;
}

export default function TextScramble({ text, className = '', trigger = true, as: Tag = 'span', delay = 0 }: Props) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!trigger) return;
    const timeout = setTimeout(() => {
      let frame = 0;
      const total = 18;
      const iter = () => {
        setDisplay(
          text.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < Math.floor((frame / total) * text.length)) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );
        frame++;
        if (frame <= total) { frameRef.current = setTimeout(iter, 40); }
        else { setDisplay(text); }
      };
      iter();
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [text, trigger, delay]);

  return <Tag className={className}>{display}</Tag>;
}
