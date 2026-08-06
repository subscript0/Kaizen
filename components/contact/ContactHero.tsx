'use client';

import { motion, useReducedMotion } from 'framer-motion';
import PageMasthead from '@/components/PageMasthead';
import RevealText from '@/components/about/RevealText';
import CountUp from '@/components/about/CountUp';
import { personalInfo } from '@/lib/data';
import { trackHireMeNow } from '@/lib/utils';

/**
 * The /contact opening — the same masthead the /about page opens on, then the
 * brief and a ledger of numbers, in ordinary document flow. This used to be a
 * plate pinned in a tall runway; see `components/PageMasthead.tsx`.
 *
 * The ledger is contact-specific rather than a re-run of /about's career
 * numbers: what a visitor about to write a message wants to know is how long
 * they will wait, how many ways in there are, and who actually does the work.
 *
 * The plate it replaced carried `/public/contact.jpeg` — a stippled handshake
 * on blue, which brought a second and third colour onto a page that is
 * otherwise ink on paper. The file is still in `/public`.
 */

const LEDGER = [
  { value: 24, suffix: 'h', label: 'Typical reply time' },
  { value: 4, suffix: '', label: 'Ways I can help' },
  { value: 100, suffix: '%', label: 'Built by me, end to end' },
];

export default function ContactHero() {
  const reduce = useReducedMotion();

  return (
    <>
      <PageMasthead
        index="01"
        label="Contact"
        title="Let’s Build"
        titleId="contact-hero-heading"
        meta="Replies within 24h"
      />

      <div className="measure pb-16 pt-12 md:pb-24 md:pt-16">
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
              text="From scratch, bolted onto something live, or just an idea you want checked — all three are a fair reason to write."
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
    </>
  );
}
