'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import StackedTitle from '@/components/Stackedtitle';
import RevealText from '@/components/about/RevealText';

export interface Service {
  /** A lucide line icon — never an emoji. See the note in `Contact.tsx`. */
  Icon: LucideIcon;
  title: string;
  desc: string;
  /** Local path under /public. Every source file is 1280×720. */
  thumb: string;
  thumbAlt: string;
}

/**
 * The services section, told the way /about tells its chapters: a sticky plate
 * on the left that shows whichever service is in the reading band, and the
 * services themselves scrolling past on the right. The plate is not decoration
 * — it names and numbers what you are reading, so the pinned column is visibly
 * *doing something* rather than merely refusing to scroll.
 *
 * ─── Why the imagery is framed the way it is ────────────────────────────────
 *
 * These are real product screenshots, and their content runs edge to edge: the
 * SpendWise shot puts "Total Balance" ~5% in from the left, QuickInvoice puts
 * the totals column ~5% in from the right. The previous build showed them in a
 * 16/9 box wrapped in `<Parallax overscale={1.16}>`, which makes the moving
 * layer 116% of the frame's HEIGHT while its width stays 100% — an effective
 * 1.53 aspect against a 1.78 source, so `object-cover` matched the height and
 * sliced 7% off each side. That cut straight through the UI text on both edges.
 *
 * So: the frame is exactly 16/9, the same aspect as every source file, and
 * nothing overscales it. `object-cover` then fits it pixel for pixel and crops
 * nothing. The motion comes from the plate instead of from the picture inside
 * it — the incoming shot wipes in from the left edge under a crossfade, which
 * reads as a plate being printed rather than a slideshow.
 *
 * Below `lg` there is no sticky column (sticky against a touch scroll is a
 * lottery, and there is no second column to pin against anyway) — each service
 * simply carries its own plate at full column width, where the screenshots are
 * bigger than they ever were in the old four-up thumbnail grid.
 */
export default function ServiceStage({ services }: { services: Service[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const report = useCallback((index: number, inView: boolean) => {
    if (inView) setActive(index);
  }, []);

  return (
    <section id="services" aria-labelledby="services-heading" className="relative py-20 lg:py-28">
      <div className="measure">
        <div className="rule-t mb-8 flex max-w-[22rem] items-baseline justify-between gap-4 pt-3">
          <span className="micro micro--strong">02</span>
          <span className="micro">Services</span>
        </div>

        <StackedTitle
          parallax
          first="What I"
          second="Build"
          id="services-heading"
          sizeClassName="text-[clamp(2.25rem,10vw,5rem)]"
        />
      </div>

      <div className="measure mt-14 grid grid-cols-1 items-start gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        {/* ══ Sticky plate — the reading position, made visible ═══════════ */}
        <div className="hidden lg:sticky lg:top-24 lg:block">
          <ServicePlate services={services} active={active} reduce={!!reduce} />
        </div>

        {/* ══ The services ═══════════════════════════════════════════════ */}
        <div className="flex flex-col gap-16 lg:gap-28">
          {services.map((service, i) => (
            <ServiceEntry
              key={service.title}
              service={service}
              i={i}
              isActive={active === i}
              reduce={!!reduce}
              report={report}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   The plate
   ══════════════════════════════════════════════════════════════════════════ */

function ServicePlate({
  services,
  active,
  reduce,
}: {
  services: Service[];
  active: number;
  reduce: boolean;
}) {
  const current = services[active];
  const total = services.length;

  return (
    <figure className="m-0">
      <div className="crop-frame rule-t rule-b rule-l rule-r relative aspect-[16/9] w-full overflow-hidden bg-[hsl(var(--background-light))]">
        {services.map((service, i) => {
          const isActive = active === i;
          return (
            <motion.div
              key={service.thumb}
              className="absolute inset-0"
              initial={false}
              animate={
                reduce
                  ? { opacity: isActive ? 1 : 0 }
                  : {
                      opacity: isActive ? 1 : 0,
                      clipPath: isActive ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)',
                    }
              }
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              // Below the crop marks (which carry z-index 2 from globals.css),
              // so the registration brackets always sit on top of the picture.
              style={{ zIndex: isActive ? 1 : 0 }}
              aria-hidden={!isActive}
            >
              <Image
                src={service.thumb}
                alt={service.thumbAlt}
                fill
                sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 1px"
                className="object-cover"
              />
            </motion.div>
          );
        })}

        {/* Pulled most of the way to monochrome, the same treatment the hero
            plate gives its video: the palette is one accent on greyscale, and
            four saturated dashboards would each contribute their own. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[hsl(var(--background)/0.28)]"
        />

        <span className="crop crop--tl" aria-hidden="true" />
        <span className="crop crop--tr" aria-hidden="true" />
        <span className="crop crop--bl" aria-hidden="true" />
        <span className="crop crop--br" aria-hidden="true" />
      </div>

      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="micro micro--strong">
          Fig. {String(active + 1).padStart(2, '0')} — {current.title}
        </span>
        <span className="micro" aria-hidden="true">
          {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </figcaption>

      {/* Progress hairline — the pin reads as travel, not as a freeze. */}
      <div aria-hidden="true" className="relative mt-3 h-px w-full bg-[var(--rule-color)]">
        <motion.span
          className="absolute inset-y-0 left-0 block bg-[hsl(var(--primary))]"
          initial={false}
          animate={{ width: `${((active + 1) / total) * 100}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   One service
   ══════════════════════════════════════════════════════════════════════════ */

function ServiceEntry({
  service,
  i,
  isActive,
  reduce,
  report,
}: {
  service: Service;
  i: number;
  isActive: boolean;
  reduce: boolean;
  report: (index: number, inView: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // A narrow band across the middle of the viewport is the "reading position".
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  const { Icon } = service;

  useEffect(() => {
    report(i, inView);
  }, [inView, i, report]);

  return (
    <motion.div
      ref={ref}
      className="lg:min-h-[38vh]"
      initial={false}
      animate={reduce ? undefined : { opacity: isActive ? 1 : 0.42 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="rule-t flex items-baseline justify-between gap-3 pt-3"
        initial={reduce ? undefined : { opacity: 0, y: 14 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="micro transition-colors duration-200"
          style={isActive ? { color: 'hsl(var(--primary-ink, var(--primary)))' } : undefined}
        >
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="micro">Service</span>
      </motion.div>

      {/* Mobile plate. Same exact 16/9 frame as the sticky one, so the
          screenshot is uncropped here too — it is simply carried inline
          because there is no second column to pin it against. */}
      <div className="crop-frame rule-b rule-l rule-r relative mt-5 aspect-[16/9] w-full overflow-hidden bg-[hsl(var(--background-light))] lg:hidden">
        <Image
          src={service.thumb}
          alt={service.thumbAlt}
          fill
          sizes="(min-width: 1024px) 1px, 100vw"
          className="object-cover"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[hsl(var(--background)/0.28)]"
        />
        <span className="crop crop--bl" aria-hidden="true" />
        <span className="crop crop--br" aria-hidden="true" />
      </div>

      <h3 className="mt-6 flex items-start gap-3 text-[clamp(1.5rem,5.4vw,2.25rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[hsl(var(--foreground))]">
        <Icon
          aria-hidden="true"
          strokeWidth={1.5}
          className="mt-[0.18em] h-[0.7em] w-[0.7em] shrink-0 transition-colors duration-300"
          style={isActive ? { color: 'hsl(var(--primary))' } : { color: 'hsl(var(--foreground) / 0.5)' }}
        />
        {service.title}
      </h3>

      <RevealText
        text={service.desc}
        className="mt-4 max-w-[46ch] text-[clamp(1.0625rem,2.6vw,1.25rem)] leading-relaxed text-[hsl(var(--muted-foreground))]"
        stagger={0.01}
      />
    </motion.div>
  );
}
