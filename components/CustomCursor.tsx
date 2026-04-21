'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    const handleMouseEnterLink = () => {
      cursor.classList.add('custom-cursor--large');
    };

    const handleMouseLeaveLink = () => {
      cursor.classList.remove('custom-cursor--large');
    };

    document.addEventListener('mousemove', handleMouseMove);

    const links = document.querySelectorAll('a, button, [data-cursor="pointer"]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', handleMouseEnterLink);
      link.addEventListener('mouseleave', handleMouseLeaveLink);
    });

    let raf: number;
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      raf = requestAnimationFrame(animateFollower);
    };
    animateFollower();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(raf);
      links.forEach((link) => {
        link.removeEventListener('mouseenter', handleMouseEnterLink);
        link.removeEventListener('mouseleave', handleMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={followerRef} className="cursor-follower hidden md:block" />
    </>
  );
}
