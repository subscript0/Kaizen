'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import PageMasthead from '@/components/PageMasthead';
import RevealText from '@/components/about/RevealText';
import CountUp from '@/components/about/CountUp';
import { personalInfo } from '@/lib/data';

/**
 * The /about opening — a masthead, then the thesis and the ledger of numbers,
 * all in ordinary document flow.
 *
 * This used to be a pinned plate in a 300dvh runway that opened to full bleed
 * as you scrolled, over a parallaxing copy of `/public/aboutme.jpeg`. See the
 * note in `components/PageMasthead.tsx` for what went and why.
 */

/**
 * The ledger. None of the three figures is a quantity any more, so none of them
 * counts.
 *
 * `CountUp` animates from 0, which is right for "10 products" and wrong for a
 * year — mid-flight it reads 1959, then 1994, then 2023, and a visitor who
 * glances at the wrong frame sees a date that means nothing. A year is a label,
 * not an amount. The row keeps its rule-draw and its staggered fade-and-rise,
 * which is the entrance the section actually reads as.
 *
 * `value` stays `number | string` and the `CountUp` branch below stays live, so
 * dropping a real countable figure back in is a one-line change.
 */
const LEDGER: Array<{ value: number | string; suffix?: string; label: string }> = [
  { value: '2023', label: 'Started building' },
  { value: 'Full stack', label: 'Frontend → Backend' },
  { value: 'Always', label: 'Learning & building' },
];

export default function AboutHero() {
  const reduce = useReducedMotion();

  return (
    <>
      <PageMasthead
        index="01"
        label="About"
        title="About Kaizen"
        titleId="about-hero-heading"
      />

      <div className="measure pb-16 pt-12 md:pb-24 md:pt-16">
        {/* ── Thesis ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.25rem_1fr] lg:gap-8">
          <span
            aria-hidden="true"
            className="micro hidden lg:block"
            style={{ writingMode: 'vertical-rl' }}
          >
            Thesis
          </span>

          <div>
            <RevealText
              text="I build modern web experiences — from interface to infrastructure."
              accentWords={['interface', 'infrastructure']}
              className="max-w-4xl text-[clamp(1.5rem,4.5vw,2.75rem)] font-semibold leading-[1.15] text-[hsl(var(--foreground))]"
              stagger={0.026}
            />

            <RevealText
              text="Frontend, backend, databases, cloud. I build the whole thing — and I'm deep in security alongside it."
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
              <dd className="text-[clamp(2.5rem,7vw,4.25rem)] font-black leading-[0.85] tracking-tight text-[hsl(var(--foreground))]">
                {typeof stat.value === 'number' ? (
                  <CountUp to={stat.value} suffix={stat.suffix} duration={1.4 + i * 0.15} />
                ) : (
                  stat.value
                )}
              </dd>
              <dt className="micro mt-3">{stat.label}</dt>
            </motion.div>
          ))}
        </dl>

        {/* ── Where to go next ────────────────────────────────────────── */}
        <motion.div
          className="mt-14 flex flex-wrap items-center gap-3"
          initial={reduce ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/projects" className="btn btn-primary" data-magnetic>
            See the work
          </Link>
          <a href={`mailto:${personalInfo.email}`} className="btn btn-outline" data-magnetic>
            Start a project
          </a>
        </motion.div>
      </div>
    </>
  );
}
