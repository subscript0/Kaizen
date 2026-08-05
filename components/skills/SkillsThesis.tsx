'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import RevealText from '@/components/about/RevealText';
import CountUp from '@/components/about/CountUp';
import { personalInfo } from '@/lib/data';
import { capabilities, TOTAL_TECHS } from './capabilities';

/**
 * The thesis and the ledger — what /about runs directly under its hero.
 *
 * Same three moves, same order: a large statement that rises word by word out
 * of its own baseline, a hairline that draws itself across, then a row of
 * figures that count up. `RevealText` and `CountUp` are imported from
 * `components/about/` rather than copied, so both pages stay on one rhythm: if
 * the stagger or the curve is retuned there, this follows.
 *
 * The section paints no background of its own — the starfield behind `main`
 * shows through.
 */

const LEDGER = [
  { value: capabilities.length, suffix: '', label: 'Disciplines' },
  { value: TOTAL_TECHS, suffix: '', label: 'Tools in rotation' },
  { value: 0, suffix: '', label: 'Self-scored percentages' },
];

export default function SkillsThesis() {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="skills-thesis-heading" className="relative">
      <h2 id="skills-thesis-heading" className="sr-only">
        The stack, in short
      </h2>

      <div className="measure pb-16 pt-20 md:pb-24 md:pt-28">
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
              text="Every tool here earns its place by shipping something — no logo wall, no progress bars, no self-scored percentages."
              accentWords={['shipping', 'something']}
              className="max-w-4xl text-[clamp(1.5rem,4.5vw,2.75rem)] font-semibold leading-[1.15] text-[hsl(var(--foreground))]"
              stagger={0.026}
            />

            <RevealText
              text="Seven disciplines, read one at a time. Each one opens on a plate that names it, then lists the tools it is built from and what each of them does in the work."
              className="text-lede mt-7 max-w-2xl"
              stagger={0.012}
              delay={0.12}
            />
          </div>
        </div>

        {/* ── Ledger ─────────────────────────────────────────────────────
            The rule draws itself across before the numbers start counting, so
            the row assembles rather than appears. */}
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
                <CountUp to={stat.value} suffix={stat.suffix} duration={1.4 + i * 0.15} />
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
    </section>
  );
}
