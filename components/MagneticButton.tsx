'use client';

import { useRef, ReactNode } from 'react';
import gsap from 'gsap';

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'a' | 'button';
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  'aria-label'?: string;
}

export default function MagneticButton({
  children, className = '', strength = 0.4, as: Tag = 'a',
  href, onClick, target, rel, 'aria-label': ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect   = el.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) * strength;
    const dy     = (e.clientY - cy) * strength;
    gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      className={`inline-block ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Tag>
  );
}
