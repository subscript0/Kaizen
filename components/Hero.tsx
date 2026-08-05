'use client';

import Link from 'next/link';
import { ArrowRight, Github, Twitter, MessageCircle, type LucideIcon } from 'lucide-react';
import { personalInfo, socialLinks } from '@/lib/data';
import { trackHireMeNow } from '@/lib/utils';
import HeroVideoBackground from '@/components/HeroVideoBackground';
import CapabilityPanel from '@/components/home/CapabilityPanel';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Github,
  Twitter: Twitter,
  WhatsApp: MessageCircle,
};

/** Print registration marks — four corner brackets, drawn with borders. */
function CropMarks() {
  return (
    <>
      <span aria-hidden="true" className="crop crop--tl" />
      <span aria-hidden="true" className="crop crop--tr" />
      <span aria-hidden="true" className="crop crop--bl" />
      <span aria-hidden="true" className="crop crop--br" />
    </>
  );
}

/**
 * The masthead — an introduction, not a positioning statement.
 *
 * The previous hero opened on "I build products, not just interfaces.", which
 * is a claim rather than a greeting: a visitor could read the whole first
 * screen without learning the person's name, their discipline or what they
 * work in. This version inverts the hierarchy. The largest thing on the page
 * is the name; directly beneath it a ruled spec row states the role and the
 * two verifiable numbers; the right-hand column is the capability index, so
 * the stack is legible before any scrolling happens.
 *
 * Layout notes:
 * - Column spans use `min-[769px]:` rather than `md:`. `.grid-12` collapses to
 *   four columns at `max-width: 768px`, and Tailwind's `md:` fires *at* 768px —
 *   so a `md:col-span-7` would briefly apply a 7-column span to a 4-column
 *   grid and overflow horizontally. 769px is the exact hand-off point.
 * - Height uses `dvh`, not `vh`: on mobile `100vh` excludes the collapsing URL
 *   chrome and pushes the last row of the section under the fixed bottom nav.
 */
export default function Hero() {
  const [years, shipped, hours] = personalInfo.stats;

  return (
    // The hero is the whole home page, so its spec band is the last thing in
    // the document. Below `md` the fixed mobile nav owns the bottom ~80px of
    // the viewport, so the section reserves ~96px of clearance — without it the
    // band sits under the bar and its links are untappable.
    <section
      id="home"
      aria-label="Introduction"
      className="relative w-full overflow-hidden pb-[calc(6rem+env(safe-area-inset-bottom))] pt-24 sm:pt-28 md:pb-0"
    >
      <HeroVideoBackground />

      {/* Every hairline below runs the full width of the viewport; the content
          it annotates stays inside `.measure`. That contrast — bleeding rules,
          held content — is the whole grammar of this style. */}
      <div className="relative z-10 flex min-h-[calc(100dvh-11rem)] flex-col md:min-h-[calc(100dvh-7rem)]">
        {/* ── Top spec rule: metadata straddling a bleed line ─────────────── */}
        <div className="bleed-b">
          <div className="measure flex items-baseline justify-between gap-4 py-3">
            <span className="micro micro--ruled">
              <span className="micro--strong">01</span>
              <span>Introduction</span>
            </span>
            <span className="micro micro--accent">
              <span
                aria-hidden="true"
                className="mr-2 inline-block h-1.5 w-1.5 bg-[hsl(var(--primary))]"
              />
              Available for work
            </span>
          </div>
        </div>

        {/* ── Hero body ───────────────────────────────────────────────────── */}
        <div className="crop-frame measure flex flex-1 flex-col justify-center pb-12 pt-10 sm:pt-14">
          <CropMarks />

          <div className="grid-12 items-start">
            {/* Nameplate — 7 of 12 columns, pinned to the left edge */}
            <div className="col-span-4 min-[769px]:col-span-7">
              <div className="animate-fade-rise flex items-center gap-3">
                {/* The avatar is small on purpose: it is an identity mark next
                    to the greeting, not a portrait plate. */}
                <img
                  src="/me.jpg"
                  alt={`${personalInfo.name}'s profile avatar`}
                  width={48}
                  height={48}
                  className="rule-t rule-b rule-l rule-r h-12 w-12 shrink-0 object-cover"
                />
                <span className="micro">Hello — my name is</span>
              </div>

              {/* The name IS the display type. `.text-display`'s own clamp tops
                  out at 5.75rem, which reads as a headline; a nameplate wants
                  to read as a poster, so the scale is overridden here only. */}
              <h1 className="text-display animate-fade-rise mt-5 text-[clamp(4rem,11vw,9rem)] text-[hsl(var(--foreground))]">
                <span className="sr-only">
                  {personalInfo.name} — {personalInfo.tagline.toLowerCase()}
                </span>
                {/* The accent full stop is the same identity mark the navbar
                    uses. It is the one place the accent appears in the
                    masthead, and it does semantic work: it marks the name. */}
                <span aria-hidden="true">
                  {personalInfo.name}
                  <span className="accent">.</span>
                </span>
              </h1>

              {/* Role + the verifiable numbers, as a ruled spec row. Labels are
                  abbreviated here because the row sits directly beneath a 144px
                  nameplate — it has to be scannable in one glance, not read. */}
              <div className="animate-fade-rise-delay rule-t mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-3.5">
                <span className="micro micro--strong">{personalInfo.tagline}</span>
                <span className="micro">
                  {years.value} yrs · {shipped.value} projects · {hours.value} hours
                </span>
              </div>

              <p className="text-lede animate-fade-rise-delay mt-6">
                {personalInfo.positioning}
              </p>

              <div className="animate-fade-rise-delay-2 mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={personalInfo.hireWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackHireMeNow('hero')}
                  className="btn btn-primary"
                  data-magnetic
                >
                  Hire me now
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                </a>
                <Link href="/projects" className="btn btn-outline" data-magnetic>
                  See the work
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                </Link>
                <Link
                  href="/about"
                  className="micro group border-b border-[hsl(var(--foreground)/0.35)] pb-1.5 transition-colors duration-200 hover:border-[hsl(var(--primary))] hover:!text-[hsl(var(--primary))]"
                >
                  More about me
                  <ArrowRight
                    className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={2.5}
                  />
                </Link>
              </div>
            </div>

            {/* Capability index — the stack, readable without scrolling */}
            <div className="animate-fade-rise-delay-2 col-span-4 mt-12 min-[769px]:col-span-4 min-[769px]:col-start-9 min-[769px]:mt-0">
              <CapabilityPanel />
            </div>
          </div>
        </div>

        {/* ── Spec band — edge-to-edge metadata under a bleed rule.
               Deliberately NOT the stats (they are printed under the nameplate
               two rows above) and NOT a "02 / Selected work" hand-off (the
               section head immediately below already says exactly that, and on
               mobile the two land within 200px of each other). It carries the
               contact details instead, which appear nowhere else on this screen.
               The email column is desktop-only: at 390px the band is a
               two-column grid ~171px wide and the address alone needs ~200px. */}
        <div className="spec-bar animate-fade-rise-delay-3">
          <a
            href={`mailto:${personalInfo.email}`}
            className="micro hidden transition-colors duration-200 hover:!text-[hsl(var(--primary))] md:inline-flex"
          >
            <span className="micro--strong">Email</span>
            {personalInfo.email}
          </a>

          <span className="micro">Built with Next.js</span>

          <span className="micro flex items-center justify-between gap-4">
            <span>Find me</span>
            <span className="flex items-center gap-4">
              {socialLinks.map((s) => {
                const Icon = SOCIAL_ICONS[s.name];
                if (!Icon) return null;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="text-[hsl(var(--foreground-muted))] transition-colors duration-200 hover:text-[hsl(var(--primary))]"
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </a>
                );
              })}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
