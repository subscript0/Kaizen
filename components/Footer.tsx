'use client';

import { personalInfo, socialLinks } from '@/lib/data';
import { trackBookACall } from '@/lib/utils';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border/50 px-6 lg:px-12 max-w-7xl mx-auto pt-24 pb-12"
      aria-label="Site footer"
    >
      {/* Big CTA block */}
      <div className="mb-20">
        <p className="section-number mb-4">Have a project in mind?</p>
        <h2 className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight leading-none mb-8 max-w-3xl">
          Let&apos;s build something{' '}
          <span className="text-primary">remarkable</span>.
        </h2>
        <div className="flex flex-wrap gap-4">
          <a
            href={personalInfo.calendlyUrl}
            className="btn-primary"
            onClick={() => trackBookACall('footer')}
          >
            Book a Call
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={`mailto:${personalInfo.email}`}
            className="btn-outline"
          >
            Send an Email
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-border/50">
        {/* Brand */}
        <p className="text-2xl font-bold tracking-tight text-foreground/20 select-none">
          KAIZEN
        </p>

        {/* Social links */}
        <nav className="flex gap-6" aria-label="Social links">
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              {s.name}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © {year} Kaizen. Built with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
