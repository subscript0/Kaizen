import PageMasthead from '@/components/PageMasthead';
import { TOTAL_TECHS } from '@/components/skills/capabilities';

/**
 * The /skills opening — the same masthead every inner route opens on.
 *
 * This used to be a plate pinned in a 290dvh runway, opening to full bleed as
 * you scrolled with the two halves of the title parting around it. It is now an
 * ordinary header, so the thesis and the first discipline are on screen when
 * the page loads; see `components/PageMasthead.tsx`.
 *
 * No longer a client component — nothing here is interactive, and the old
 * `'use client'` was only ever there for the scroll-driven hero.
 *
 * This section paints no page background of its own. An opaque fill on this
 * route is what used to hide the sitewide starfield here.
 */
export default function SkillsHero() {
  return (
    <PageMasthead
      index="01"
      label="Skills"
      title="The Stack"
      titleId="skills-hero-heading"
      meta={`${TOTAL_TECHS} tools`}
    />
  );
}
