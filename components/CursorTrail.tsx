'use client';

import { useEffect } from 'react';

const TRAIL_LENGTH = 12;

interface Dot {
  el: HTMLDivElement;
  x:  number;
  y:  number;
}

export default function CursorTrail() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const dots: Dot[] = [];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9990;';
    document.body.appendChild(container);

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const el = document.createElement('div');
      const size = 6 - i * 0.35;
      const opacity = 0.6 - i * 0.045;
      el.style.cssText = `
        position:fixed;top:0;left:0;
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:hsl(var(--primary));
        opacity:${opacity};
        pointer-events:none;
        transform:translate(-50%,-50%);
        transition:opacity 0.1s;
        will-change:transform;
      `;
      container.appendChild(el);
      dots.push({ el, x: -100, y: -100 });
    }

    let mouseX = -100, mouseY = -100;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const tick = () => {
      let px = mouseX, py = mouseY;
      dots.forEach((dot, i) => {
        const lerp = 0.45 - i * 0.03;
        dot.x += (px - dot.x) * lerp;
        dot.y += (py - dot.y) * lerp;
        dot.el.style.left = `${dot.x}px`;
        dot.el.style.top  = `${dot.y}px`;
        px = dot.x;
        py = dot.y;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.body.removeChild(container);
    };
  }, []);

  return null;
}
