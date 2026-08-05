'use client';

import { motion, useReducedMotion } from 'framer-motion';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import RevealText from '@/components/about/RevealText';
import CountUp from '@/components/about/CountUp';
import { personalInfo } from '@/lib/data';
import { trackHireMeNow } from '@/lib/utils';

/**
 * The /contact opening — the same device the /about page opens on.
 *
 * A pinned plate of motion that expands to full bleed as the visitor scrolls,
 * then hands straight over to the brief and a ledger of numbers. Everything
 * below the plate is ordinary document flow; see the long note in
 * `components/ui/scroll-expansion-hero.tsx` for why the expansion is driven by
 * real scroll position instead of a `wheel` lock.
 *
 * The ledger is contact-specific rather than a re-run of /about's career
 * numbers: what a visitor about to write a message wants to know is how long
 * they will wait, how many ways in there are, and who actually does the work.
 *
 * The plate is `/public/contact.jpeg` — this page's own image, not the video
 * poster the home page opens on. Every route now leads with its own frame so
 * no two openings read as the same picture.
 *
 * Media is local. The site's accent is chosen at runtime, so nothing here
 * hardcodes a hue.
 */

const LEDGER = [
  { value: 24, suffix: 'h', label: 'Typical reply time' },
  { value: 4, suffix: '', label: 'Ways I can help' },
  { value: 100, suffix: '%', label: 'Built by me, end to end' },
];

export default function ContactHero() {
  const reduce = useReducedMotion();

  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/contact.jpeg"
      mediaAlt="Two hands meeting in a firm handshake, drawn as a stippled illustration on blue."
      bgImageSrc="/contact.jpeg"
      title="Let’s Build"
      titleId="contact-hero-heading"
      date="01 — Contact"
      scrollToExpand="Scroll to expand"
      textBlend
    >
      <div className="measure pb-16 pt-20 md:pb-24 md:pt-28">
        {/* ── The brief ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.25rem_1fr] lg:gap-8">
          <span
            aria-hidden="true"
            className="micro hidden lg:block"
            style={{ writingMode: 'vertical-rl' }}
          >
            Brief
          </span>

          <div>
            <RevealText
              text="Tell me what you’re building. I’ll tell you what it takes, what it costs, and what I’d cut."
              accentWords={['you’re', 'building.']}
              className="max-w-4xl text-[clamp(1.5rem,4.5vw,2.75rem)] font-semibold leading-[1.15] text-[hsl(var(--foreground))]"
              stagger={0.026}
            />

            <RevealText
              text="A product from scratch, a feature bolted onto something live, or an hour spent working out whether the idea holds up at all — all three are a fair reason to write."
              className="text-lede mt-7 max-w-2xl"
              stagger={0.012}
              delay={0.12}
            />
          </div>
        </div>

        {/* ── Ledger ─────────────────────────────────────────────────────
            A rule draws itself across before the numbers start counting, so the
            row assembles rather than appears. */}
        <motion.div
          aria-hidden="true"
          className="mt-14 h-px w-full origin-left bg-[var(--rule-color)]"
          initial={reduce ? undefined : { scaleX: 0 }}
          whileInView={reduce ? undefined : { scaleX: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 pt-8 sm:grid-cols-3">
          {LEDGER.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? undefined : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <dd className="text-[clamp(2.25rem,6.4vw,4.25rem)] font-black leading-[0.85] tracking-tight text-[hsl(var(--foreground))]">
                <CountUp to={stat.value} suffix={stat.suffix} duration={1.4 + i * 0.15} />
              </dd>
              <dt className="micro mt-3">{stat.label}</dt>
            </motion.div>
          ))}
        </dl>

        {/* ── Where to go next ─────────────────────────────────────────────
            Two doors, offered before the long scroll rather than after it: the
            form is a long way down this page, and a visitor who already knows
            what they want should not have to travel to it. */}
        <motion.div
          className="mt-14 flex flex-wrap items-center gap-3"
          initial={reduce ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href={personalInfo.hireWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={() => trackHireMeNow('contact-hero')}
            data-magnetic
          >
            Hire me now
          </a>
          <a href="#send" className="btn btn-outline" data-magnetic>
            Send a message
          </a>
        </motion.div>
      </div>
    </ScrollExpandMedia>
  );
}
