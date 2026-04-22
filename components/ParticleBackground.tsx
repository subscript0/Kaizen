'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [primaryColor, setPrimaryColor] = useState('59, 130, 246'); // fallback blue

  // Watch for theme changes (primary color)
  useEffect(() => {
    const getPrimaryRGB = () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim();
      // Expected format: "217 91% 60%" (HSL) or "59, 130, 246" (RGB)
      // We'll convert HSL to RGB for consistency.
      if (color.includes('%')) {
        // Convert HSL to RGB (simple version)
        const parts = color.split(' ');
        const h = parseInt(parts[0], 10);
        const s = parseInt(parts[1], 10);
        const l = parseInt(parts[2], 10);
        // Convert hsl to rgb (approximate)
        const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l / 100 - c / 2;
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
      }
      // If already RGB (like fallback or some themes)
      if (color.includes(',')) return color;
      return '59, 130, 246';
    };
    setPrimaryColor(getPrimaryRGB());

    const observer = new MutationObserver(() => {
      setPrimaryColor(getPrimaryRGB());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

    return () => observer.disconnect();
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
      particles = Array.from({ length: count }, () => {
        const baseSize = Math.random() * 2.5 + 0.8;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: baseSize,
          baseSize,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = performance.now() / 1000;

      // Update particles
      for (const p of particles) {
        p.size = p.baseSize + Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.3;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 150;
          if (dist < maxDist) {
            const intensity = 1 - dist / maxDist;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${primaryColor}, ${0.12 * intensity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles with glow
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryColor}, 0.7)`;
        ctx.fill();
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${primaryColor}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Mouse repulsion
      if (mouseRef.current.active && canvas) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        for (const p of particles) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - dist) / 100 * 0.5;
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
            const maxVel = 1.5;
            p.vx = Math.min(maxVel, Math.max(-maxVel, p.vx));
            p.vy = Math.min(maxVel, Math.max(-maxVel, p.vy));
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    const handleResize = () => {
      resize();
      createParticles();
    };

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [primaryColor]);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}