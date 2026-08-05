'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

interface ParticleBackgroundProps {
  /** Pin to the full viewport (sitewide backdrop). Pass false to scope the
   *  canvas to its own `relative` parent instead — e.g. a single section. */
  fixed?: boolean;
}

export default function ParticleBackground({ fixed = true }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Get CSS variables for colors
  const getCssVariable = (variable: string): string => {
    if (typeof window === 'undefined') return '';
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
  };

  const getPrimaryColor = useCallback(() => {
    const hsl = getCssVariable('--primary');
    if (!hsl) return '195 91% 53%'; // fallback to motion.design primary
    return hsl;
  }, []);

  const [primaryColor, setPrimaryColor] = useState<string>(getPrimaryColor());

  // Update CSS variable when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(() => {
      setPrimaryColor(getPrimaryColor());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Also listen for CSS variable changes
    const handleStyleChange = () => {
      setPrimaryColor(getPrimaryColor());
    };

    window.addEventListener('resize', handleStyleChange);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleStyleChange);
    };
  }, [getPrimaryColor]);

  // Refs for animation and particles
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseSize: number;
    pulseSpeed: number;
    pulsePhase: number;
  }>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const init = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resizeCanvas = () => {
        if (fixed) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        } else {
          const rect = canvas.parentElement?.getBoundingClientRect();
          canvas.width = rect?.width ?? window.innerWidth;
          canvas.height = rect?.height ?? window.innerHeight;
        }
      };

      const createParticles = () => {
        if (!canvas) return [];
        const count = Math.min(
          80,
          Math.floor((canvas.width * canvas.height) / 15000)
        );
        return Array.from({ length: count }, () => {
          const baseSize = Math.random() * 2 + 0.5;
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: baseSize,
            baseSize,
            pulseSpeed: 0.008 + Math.random() * 0.012, // Slower, more ambient pulse
            pulsePhase: Math.random() * Math.PI * 2,
          };
        });
      };

      // Initialize particles
      particlesRef.current = createParticles();

      const draw = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const time = performance.now() / 1000;

        // Update particles with motion-inspired physics
        for (const p of particlesRef.current) {
          // Gentle, floating motion - using ambient easing concepts
          p.x += p.vx;
          p.y += p.vy; // Fixed: was 'y += p.vy;'

          // Soft boundaries with gentle repulsion
          if (p.x < 20) {
            p.vx += 0.0005 * (20 - p.x);
          } else if (p.x > canvas.width - 20) {
            p.vx -= 0.0005 * (p.x - (canvas.width - 20));
          }

          if (p.y < 20) {
            p.vy += 0.0005 * (20 - p.y);
          } else if (p.y > canvas.height - 20) {
            p.vy -= 0.0005 * (p.y - (canvas.height - 20));
          }

          // Gentle drift towards center
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const dxToCenter = centerX - p.x;
          const dyToCenter = centerY - p.y;
          const distanceToCenter = Math.sqrt(
            dxToCenter * dxToCenter + dyToCenter * dyToCenter
          );

          // Very subtle center attraction
          if (distanceToCenter > 100) {
            p.vx += (dxToCenter / distanceToCenter) * 0.0001;
            p.vy += (dyToCenter / distanceToCenter) * 0.0001;
          }

          // Pulse size with ambient easing
          p.size =
            p.baseSize +
            Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.4;
        }

        // Draw connections with motion-inspired subtlety
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const dx = particlesRef.current[i].x - particlesRef.current[j].x;
            const dy = particlesRef.current[i].y - particlesRef.current[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 120;

            if (dist < maxDist) {
              const intensity = 1 - dist / maxDist;
              // Use ambient opacity for connections
              const opacity = 0.08 * intensity;

              ctx.beginPath();
              ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
              ctx.strokeStyle = `rgba(${primaryColor}, ${opacity})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }

        // Draw particles with soft glow
        for (const p of particlesRef.current) {
          // Outer glow
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${primaryColor}, 0.3)`;
          ctx.fillStyle = `rgba(${primaryColor}, 0.6)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Inner core
          ctx.fillStyle = `rgba(${primaryColor}, 0.8)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mouse repulsion with softer effect
        if (
          mouseRef.current.active &&
          canvas &&
          typeof window !== 'undefined'
        ) {
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;

          for (const p of particlesRef.current) {
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 150;

            if (dist < influenceRadius) {
              const angle = Math.atan2(dy, dx);
              // Softer, more repellent force
              const force =
                ((influenceRadius - dist) / influenceRadius) * 0.08;
              p.vx -= Math.cos(angle) * force;
              p.vy -= Math.sin(angle) * force;

              // Gentle velocity damping
              const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
              const maxSpeed = 0.6;
              if (speed > maxSpeed) {
                p.vx = (p.vx / speed) * maxSpeed;
                p.vy = (p.vy / speed) * maxSpeed;
              }
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(draw);
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (fixed) {
          mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
        } else {
          const rect = canvas.getBoundingClientRect();
          mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
        }
      };

      const handleMouseLeave = () => {
        mouseRef.current.active = false;
      };

      resizeCanvas();
      draw();

      resizeObserverRef.current = new ResizeObserver(() => {
        resizeCanvas();
        // Create new particles to match new canvas size
        particlesRef.current = createParticles();
      });

      resizeObserverRef.current.observe(fixed ? document.body : (canvas.parentElement ?? document.body));

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    // Handle reduced motion preference
    const checkReducedMotion = () => {
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animation for reduced motion
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      } else {
        init();
      }
    };

    // Check initially and on change
    checkReducedMotion();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Disable animation
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      } else {
        // Re-enable animation
        init();
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [primaryColor, fixed]);

  return (
    <canvas
      ref={canvasRef}
      className={fixed ? 'fixed inset-0 -z-10 pointer-events-none' : 'absolute inset-0 pointer-events-none'}
      aria-hidden="true"
    />
  );
}