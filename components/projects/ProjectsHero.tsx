'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import RevealText from '@/components/about/RevealText';
import CountUp from '@/components/about/CountUp';
import { personalInfo, projects } from '@/lib/data';

/**
 * The /projects opening — the sibling of `components/about/AboutHero`.
 *
 * Same device, different subject: a plate that opens to full bleed as the
 * visitor scrolls, then hands over to the thesis and a ledger of numbers.
 * Everything below the plate is ordinary document flow — see the long note in
 * `components/ui/scroll-expansion-hero.tsx` for why that matters.
 *
 * The plate is this page's own image, `/public/project.jpeg`. Every route now
 * leads with its own frame — home keeps `/me.jpg`, /about `/aboutme.jpeg`,
 * /skills `/skill.jpeg` — so no two openings read as the same picture. Media is
 * local; the site's accent is picked at runtime, so nothing here hardcodes a
 * colour.
 *
 * The masthead is deliberately short. `ScrollExpandMedia` slides the two halves
 * of the title apart by `min(9.5vw, 180px)` as the plate opens, and that travel
 * has to fit in the free space either side of the lockup — a 13-character
 * masthead leaves ~28px per side at 390px against a 37px shift, which clips.
 * Two short words never can.
 */

/** Every technology that appears in the work, in the order it first appears. */
const STACK = Array.from(new Set(projects.flatMap((project) => project.techStack)));

/* Derived from `lib/data`, not typed out: add a fifth project and the ledger
   counts it. Only "years building" is a fact about the person rather than the
   data, and it matches the same figure on /about. */
const LEDGER = [
  { value: projects.length, suffix: '', label: 'Products shipped' },
  { value: STACK.length, suffix: '', label: 'Technologies used' },
  { value: 5, suffix: '', label: 'Years building' },
];

export default function ProjectsHero() {
  const reduce = useReducedMotion();

  return (
    <ScrollExpandMedia
      mediaType="image"
      /* The plate is `object-cover`, so at its collapsed 340x414 the visitor
         sees only the middle ~40% of the square frame. This image survives that
         crop: the lit bulb and the drawing hand sit dead centre, so the subject
         is whole at every step of the expansion. */
      mediaSrc="/project.jpeg"
      mediaAlt="A hand drawing a glowing lightbulb on paper, wired into a sketched diagram of product ideas."
      bgImageSrc="/project.jpeg"
      title="The Work"
      titleId="projects-hero-heading"
      date="01 — Projects"
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
            Index
          </span>

          <div>
            <RevealText
              text="Four products, built end-to-end and shipped — then used every day by the person who needed them."
              accentWords={['end-to-end', 'shipped']}
              className="max-w-4xl text-[clamp(1.5rem,4.5vw,2.75rem)] font-semibold leading-[1.15] text-[hsl(var(--foreground))]"
              stagger={0.026}
            />

            <RevealText
              text="Personal finance, project management, invoicing and study tracking. Every one started as a problem I actually had, and every one had to keep working long after launch."
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
          <Link href="#projects" className="btn btn-primary" data-magnetic>
            See the index
          </Link>
          <a href={`mailto:${personalInfo.email}`} className="btn btn-outline" data-magnetic>
            Start a project
          </a>
        </motion.div>
      </div>
    </ScrollExpandMedia>
  );
}
