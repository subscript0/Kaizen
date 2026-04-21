'use client';

import { personalInfo, socialLinks } from '@/lib/data';
import { trackBookACall } from '@/lib/utils';
import MagneticButton from './MagneticButton';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t px-6 lg:px-12 max-w-7xl mx-auto pt-24 pb-12"
      style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
      aria-label="Site footer"
    >
      {/* Big CTA */}
      <div className="mb-20">
        <p className="section-number mb-4">Have a project in mind?</p>
        <h2
          className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight leading-none mb-8 max-w-3xl"
          style={{ color: 'hsl(var(--foreground))' }}
        >
          Let&apos;s build something{' '}
          <span style={{ color: 'hsl(var(--primary))' }}>remarkable</span>.
        </h2>
        <div className="flex flex-wrap gap-4">
          <MagneticButton
            href={personalInfo.calendlyUrl}
            className="btn-primary"
            onClick={() => trackBookACall('footer')}
            strength={0.4}
          >
            Book a Call
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="inline ml-2" aria-hidden="true">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </MagneticButton>
          <MagneticButton
            href={`mailto:${personalInfo.email}`}
            className="btn-outline"
            strength={0.4}
          >
            Send an Email
          </MagneticButton>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t"
        style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
      >
        <p
          className="text-2xl font-bold tracking-tight select-none"
          style={{ color: 'hsl(var(--foreground) / 0.15)' }}
        >
          KAIZEN
        </p>

        <nav className="flex gap-6" aria-label="Social links">
          {socialLinks.map(s => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest transition-colors"
              style={{ color: 'hsl(var(--muted-foreground))' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--primary))')}
              onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}
            >
              {s.name}
            </a>
          ))}
        </nav>

        <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
          © {year} Kaizen. Built with Next.js &amp; Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
