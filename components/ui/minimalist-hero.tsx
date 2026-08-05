'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the props interface for type safety and reusability
interface MinimalistHeroProps {
  logoText: string;
  mainText: string;
  readMoreLink: string;
  imageSrc: string;
  imageAlt: string;
  overlayText: {
    part1: string;
    part2: string;
  };
  socialLinks: { icon: LucideIcon; href: string; name: string }[];
}

// The main reusable Hero Section component
export const MinimalistHero = ({
  logoText,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  socialLinks,
}: MinimalistHeroProps) => {
  return (
    <section
      id="home"
      aria-label="Hero section"
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden px-4 pb-12 pt-20 sm:px-6 lg:px-8',
      )}
      data-reveal
    >
      {/* Main content — 3 columns like the minimalist reference */}
      <div className="relative grid w-full max-w-[980px] flex-grow gap-8 md:grid-cols-3 md:gap-6">
        {/* Left: positioning + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-20 order-2 md:order-1 md:text-left"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {logoText}
          </p>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground md:mx-0">
            {mainText}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a
              href={readMoreLink}
              className="btn btn-outline inline-flex items-center gap-3 px-6 py-3 text-sm text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
              data-magnetic
            >
              View Work
            </a>
          </div>
        </motion.div>

        {/* Center: photo in a theme-accent circle */}
        <div className="relative order-1 flex h-full items-center justify-center md:order-2">
          {/* Accent circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 h-[280px] w-[280px] rounded bg-primary/90 md:h-[360px] md:w-[360px] lg:h-[440px] lg:w-[440px]"
          />
          {/* Photo */}
          <motion.img
            src={imageSrc}
            alt={`${imageAlt} — Full-Stack Developer`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="relative z-10 h-56 w-56 rounded-xl border border-border/30 bg-background-light/30 backdrop-blur-sm object-cover shadow-lg md:h-72 md:w-72 lg:h-80 lg:w-80"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.onerror = null;
              t.src = 'https://placehold.co/400x400/1e293b/ffffff?text=Kaizen';
            }}
          />
        </div>

        {/* Right: big overlay headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-end md:text-right"
        >
          <h1 className="text-[clamp(3.5rem,16vw,9rem)] font-extrabold leading-[0.9] tracking-tight text-foreground">
            {overlayText.part1}
            <br />
            <span className="text-primary">{overlayText.part2}</span>
          </h1>
        </motion.div>
      </div>

      {/* Socials row (no footer — kept minimal) */}
      <div className="z-30 flex w-full max-w-[980px] items-center justify-center gap-6 pt-8 md:justify-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex items-center gap-5"
        >
          {socialLinks.map((s) => {
            const Icon = s.icon;
            if (!Icon) return null;
            return (
              <a
                key={s.href} // Use href as unique key
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${s.href}`} // Describe the link
                className="text-muted-foreground/80 transition-colors duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:text-primary/90"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};