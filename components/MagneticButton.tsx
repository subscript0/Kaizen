'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticButton({ children, className = '', href, onClick, strength = 0.35 }: Props) {
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const el = btnRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * strength;
      const dy   = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const onLeave = () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    };

    const onEnter = () => {
      el.style.transition = 'transform 0.1s ease';
    };

    el.addEventListener('mousemove',  onMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove',  onMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  const props = { ref: btnRef, className, onClick };

  if (href) {
    return <a {...props} href={href}>{children}</a>;
  }
  return <button {...props}>{children}</button>;
}
