'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import RevealText from '@/components/about/RevealText';
import CountUp from '@/components/about/CountUp';
import { personalInfo } from '@/lib/data';

/**
 * The /about opening.
 *
 * A pinned plate of motion that opens to full bleed as the visitor scrolls,
 * then hands straight over to the thesis and the ledger of numbers. Everything
 * below the plate is ordinary document flow — see the long note in
 * `components/ui/scroll-expansion-hero.tsx` for why that matters.
 *
 * The plate is `/public/aboutme.jpeg` — this page's own image, not the video
 * poster the home page opens on. Every route now leads with its own frame so
 * no two openings read as the same picture.
 *
 * Media is local. The site's accent is picked at runtime, so nothing here
 * hardcodes a colour.
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
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/aboutme.jpeg"
      mediaAlt="The word “ME” set in heavy white capitals on black."
      bgImageSrc="/aboutme.jpeg"
      title="About Kaizen"
      titleId="about-hero-heading"
      date="01 — About"
      scrollToExpand="Scroll to expand"
      textBlend
    >
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
              text="I build modern web experiences — from interface to infrastructure."
              accentWords={['interface', 'infrastructure']}
              className="max-w-4xl text-[clamp(1.5rem,4.5vw,2.75rem)] font-semibold leading-[1.15] text-[hsl(var(--foreground))]"
              stagger={0.026}
            />

            <RevealText
              text="I'm a full-stack developer focused on building modern, scalable web applications with clean architecture and intuitive user experiences. From frontend interfaces and backend systems to databases, cloud infrastructure, and product design, I enjoy creating software that's fast, maintainable, and built to solve real-world problems while continuously expanding my expertise in cybersecurity."
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
    </ScrollExpandMedia>
  );
}
