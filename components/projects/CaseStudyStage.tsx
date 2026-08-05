'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, type CSSProperties } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import SectionHead from '@/components/SectionHead';
import { projects } from '@/lib/data';
import type { Project } from '@/types';

/**
 * The gallery — editorial imagery at scale.
 *
 * The index above this shows each project as a 4:3 plate in a column. This
 * section gives the same four builds the whole viewport: a `position: sticky`
 * stage inside a tall runway, cross-fading from one screen to the next as the
 * runway passes, with the caption sliding up from behind its own baseline each
 * time the frame changes.
 *
 * It is scroll-*linked*, not scroll-*triggered* — the visitor is driving the
 * cross-fade, which is the only thing that justifies pinning a section. And it
 * is sticky rather than hijacked: the document scrolls normally the whole way,
 * so wheel, touch, keyboard, scrollbar dragging and find-in-page keep working,
 * and the section can simply be scrolled past.
 *
 * Accessibility: the stage is one `aria-hidden` picture. The same four case
 * studies are emitted once, in order, as a plain linked list for assistive tech
 * — screen readers get the content and the links, not a pile of cross-fading
 * absolutely-positioned duplicates.
 *
 * Nothing here is interactive. A link whose destination changes underneath the
 * pointer as you scroll is a mis-click waiting to happen; every project in this
 * section is already one tap away in the index above.
 */

const N = projects.length;

/** The second screenshot, so the gallery is not a re-run of the index thumbnails. */
const shotOf = (project: Project) => project.images[1] ?? project.thumbnail;

export default function CaseStudyStage() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const counter = useTransform(scrollYProgress, (v) =>
    String(Math.min(N, Math.max(1, Math.floor(v * N) + 1))).padStart(2, '0'),
  );
  const meterScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const current = projects[active] ?? projects[0];

  return (
    <section className="relative" aria-labelledby="showcase-heading">
      <motion.div
        className="measure pt-16 md:pt-24"
        initial={reduce ? undefined : { opacity: 0, y: 18 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionHead
          index="03"
          label="Case studies"
          id="showcase-heading"
          title="The screens, at size."
          lede="Four builds, one frame at a time. Scroll to move through them."
          className="mb-10 md:mb-14"
        />
      </motion.div>

      {/* The accessible copy of this section. */}
      <ol className="sr-only">
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.slug}`}>
              {project.number} {project.title} — {project.description} Built with{' '}
              {project.techStack.join(', ')}.
            </Link>
          </li>
        ))}
      </ol>

      {reduce ? (
        <StaticGallery />
      ) : (
        <div
          ref={runwayRef}
          /* One screen of runway per project, a little tighter on phones where
             a full viewport per frame is a long way to travel with a thumb. */
          className="relative h-[calc(var(--stage-count)*78dvh)] md:h-[calc(var(--stage-count)*108dvh)]"
          style={{ '--stage-count': N } as CSSProperties}
        >
          <div className="bleed-t bleed-b sticky top-0 h-[100dvh] w-full overflow-hidden">
            {projects.map((project, i) => (
              <Frame key={project.id} project={project} index={i} progress={scrollYProgress} />
            ))}

            {/* Legibility scrim — the one gradient this design system allows,
                and only because display type has to survive a screenshot. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, hsl(var(--background) / 0.94) 0%,' +
                  'hsl(var(--background) / 0.72) 32%,' +
                  'hsl(var(--background) / 0.22) 62%,' +
                  'hsl(var(--background) / 0.5) 100%)',
              }}
            />

            {/* ── Top rail ─────────────────────────────────────────────── */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
              <span
                aria-hidden="true"
                className="block h-px w-full bg-[hsl(var(--foreground)/0.14)]"
              >
                <motion.span
                  className="block h-px w-full origin-left bg-[hsl(var(--primary))]"
                  style={{ scaleX: meterScale }}
                />
              </span>

              <div className="measure flex items-baseline justify-between gap-4 pt-5">
                <span className="micro micro--accent">Case study</span>
                <span className="micro" aria-hidden="true">
                  <motion.span>{counter}</motion.span> / {String(N).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* ── Frame rail (wide screens only) ───────────────────────── */}
            <ol
              aria-hidden="true"
              className="pointer-events-none absolute right-[var(--gutter)] top-1/2 z-10 hidden -translate-y-1/2 lg:block"
            >
              {projects.map((project, i) => (
                <li key={project.id} className="rule-t relative flex items-center gap-3 py-3 pl-4">
                  {active === i ? (
                    <motion.span
                      layoutId="case-study-marker"
                      className="absolute left-0 top-0 h-full w-[2px] bg-[hsl(var(--primary))]"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  ) : null}
                  <span
                    className="micro transition-colors duration-200"
                    style={
                      active === i ? { color: 'hsl(var(--primary-ink, var(--primary)))' } : undefined
                    }
                  >
                    {project.number}
                  </span>
                  <span
                    className="micro w-[9ch] transition-colors duration-200"
                    style={active === i ? { color: 'hsl(var(--foreground))' } : undefined}
                  >
                    {project.title}
                  </span>
                </li>
              ))}
            </ol>

            {/* ── Caption ──────────────────────────────────────────────────
                Bottom padding clears the 80px fixed mobile navbar, so the
                title of whatever is on screen is never underneath it. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-[calc(96px+env(safe-area-inset-bottom,0px))] md:pb-14">
              <div className="measure">
                <div className="relative h-[13.5rem] sm:h-[14.5rem] lg:h-[16rem]">
                  <AnimatePresence initial={false}>
                    <Caption key={current.id} project={current} />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   One frame of the gallery
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * A single screenshot layer. Each owns a slice of the runway and fades through
 * its neighbours' slices, so consecutive frames dissolve into each other rather
 * than cutting. The picture also settles from 1.14 to 1.02 across its own slice
 * — slow enough to read as the frame coming to rest, not as a zoom.
 */
function Frame({
  project,
  index,
  progress,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
}) {
  const band = 1 / N;
  const fade = band * 0.3;
  const first = index === 0;
  const last = index === N - 1;

  const stops: number[] = [];
  const values: number[] = [];

  if (first) {
    stops.push(0);
    values.push(1);
  } else {
    stops.push(index * band - fade, index * band + fade * 0.4);
    values.push(0, 1);
  }

  if (last) {
    stops.push(1);
    values.push(1);
  } else {
    stops.push((index + 1) * band - fade * 0.4, (index + 1) * band + fade);
    values.push(1, 0);
  }

  const opacity = useTransform(progress, stops, values);
  const scale = useTransform(progress, [stops[0], stops[stops.length - 1]], [1.14, 1.02]);
  const y = useTransform(progress, [stops[0], stops[stops.length - 1]], ['3%', '-3%']);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }} aria-hidden="true">
      <motion.div
        className="absolute inset-0 will-change-transform"
        /* Pulled towards monochrome, exactly as the hero plate is: the palette
           is one accent on greyscale, and four saturated product screenshots at
           full bleed would introduce a dozen more colours to the page. */
        style={{ scale, y, filter: 'saturate(0.4) contrast(1.05)' }}
      >
        <Image
          src={shotOf(project)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Caption
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Keyed on the project, so every frame change genuinely remounts this and the
 * entrance plays again. The title rises out of its own mask — the same
 * typesetting move the rest of the site uses for display type — while the
 * outgoing caption slides down and out underneath it.
 */
function Caption({ project }: { project: Project }) {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.p
        className="micro micro--accent tabular-nums"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {project.number}
      </motion.p>

      <span className="mt-4 block overflow-hidden pb-[0.06em]">
        <motion.span
          className="block text-[clamp(2.25rem,8vw,4.5rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-[hsl(var(--foreground))]"
          initial={{ y: '105%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          {project.title}
        </motion.span>
      </span>

      <motion.p
        className="mt-4 max-w-[46ch] text-sm leading-relaxed text-[hsl(var(--foreground)/0.82)] sm:text-base"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {project.description}
      </motion.p>

      <motion.p
        className="micro mt-5 flex flex-wrap gap-x-4 gap-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        {project.techStack.slice(0, 4).map((tech) => (
          <span key={tech} className="whitespace-nowrap">
            {tech}
          </span>
        ))}
      </motion.p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Reduced motion
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * No runway, no pin, no cross-fade: the same four screens as a plain stack of
 * captioned figures. The section still exists and still shows the work at
 * scale — it just stops being a scroll mechanism.
 */
function StaticGallery() {
  return (
    <div className="measure flex flex-col gap-16">
      {projects.map((project) => (
        <figure key={project.id} className="crop-frame relative m-0" aria-hidden="true">
          <span className="relative block aspect-[16/9] w-full overflow-hidden">
            <Image
              src={shotOf(project)}
              alt=""
              fill
              sizes="(min-width: 1240px) 1160px, 100vw"
              className="object-cover"
              style={{ filter: 'saturate(0.4) contrast(1.05)' }}
            />
          </span>
          <span className="crop crop--tl" />
          <span className="crop crop--tr" />
          <span className="crop crop--bl" />
          <span className="crop crop--br" />

          <figcaption className="rule-t mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-4">
            <span className="micro micro--strong tabular-nums">{project.number}</span>
            <span className="text-lg font-semibold text-[hsl(var(--foreground))]">
              {project.title}
            </span>
            <span className="micro">{project.techStack.slice(0, 3).join('  ')}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
