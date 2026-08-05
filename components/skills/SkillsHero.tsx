'use client';

import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

/**
 * The /skills opening — the same device that opens /about.
 *
 * A plate of work sits centred on the registration grid; scrolling opens it to
 * full bleed while the two halves of the title part around it. The mechanic
 * lives in `components/ui/scroll-expansion-hero.tsx` (shared, read-only): a
 * `position: sticky` stage inside a tall runway, driven by real scroll
 * position. Nothing hijacks the wheel, so the page can be scrolled, flicked,
 * dragged by the scrollbar or paged with the keyboard the whole way through.
 *
 * Two deliberate differences from /about's hero:
 *
 *  - The plate is this page's own image, `/public/skill.jpeg`. Every route now
 *    leads with its own frame — home keeps `/me.jpg`, /about `/aboutme.jpeg`,
 *    /projects `/project.jpeg` — so no two openings read as the same picture.
 *    `next.config.ts` blocks remote hosts, so the file is local.
 *  - `textBlend` is off. `mix-blend-mode: difference` inverts whatever is
 *    behind it, which would repaint the accent word in a colour the visitor
 *    did not choose — and the accent is the single colour this page is
 *    disciplined about. The component's own scrim carries the contrast
 *    instead, deepening as the plate opens.
 *
 * NO CHILDREN ARE PASSED. The component wraps its children in an opaque
 * `background` fill, and an opaque fill on this route is exactly what hid the
 * sitewide starfield here before. Everything after the hero is a sibling
 * section in `app/skills/page.tsx`, painting nothing of its own.
 */
export default function SkillsHero() {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/skill.jpeg"
      mediaAlt="Wooden letter blocks on a desk spelling SKIL, with a hand setting the final L in place."
      bgImageSrc="/skill.jpeg"
      title="The Stack"
      titleId="skills-hero-heading"
      date="01 — Skills"
      scrollToExpand="Scroll to expand"
    />
  );
}
