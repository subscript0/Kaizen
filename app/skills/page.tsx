import type { Metadata } from 'next';
import SkillsHero from '@/components/skills/SkillsHero';
import SkillsThesis from '@/components/skills/SkillsThesis';
import DisciplineChapters from '@/components/skills/DisciplineChapters';
import MarkWall from '@/components/skills/MarkWall';
import SkillsOutro from '@/components/skills/SkillsOutro';

/**
 * /skills — the server shell.
 *
 * Stays a server component purely so the route can export metadata; every
 * interactive piece lives in `components/skills/*`. Without this split the tab
 * title falls back to the root layout's default.
 */
export const metadata: Metadata = {
  // The root layout applies a `%s | Kaizen` template, so this renders as
  // "Skills | Kaizen" in the tab.
  title: 'Skills',
  description:
    'Seven disciplines — frontend, backend, database, tooling, cloud, design and cybersecurity — each listed with what it actually does in the work.',
  alternates: { canonical: '/skills' },
};

/**
 * Read top to bottom, built on the same devices as /about:
 *
 *   SkillsHero          a plate of shipped work that opens to full bleed as you
 *                       scroll, the title parting around it
 *   SkillsThesis        the statement and the ledger of figures that count up
 *   DisciplineChapters  seven chapters, each against its own sticky plate, with
 *                       its tools listed in their real brand colours
 *   MarkWall            the pinned section: every mark colours in, one at a
 *                       time, at the pace you scroll
 *   SkillsOutro         the closing lockup and the terminal spec band
 *
 * Every pinned moment on this page (SkillsHero, MarkWall) and every plate in
 * DisciplineChapters is `position: sticky` inside ordinary flow. Nothing here
 * listens for `wheel`, calls `window.scrollTo`, or asks GSAP for a pin — so the
 * document scrolls normally the whole way down and keyboard, touch, scrollbar
 * dragging and find-in-page all keep working. It also means a scroll JUMP lands
 * on one correct frame rather than somewhere between two.
 *
 * No section paints an opaque page background. The sitewide starfield
 * (`components/CosmicBackdrop.tsx`) is a fixed layer behind `main`, and a fill
 * on this route is what used to make /skills the only page missing it.
 */
export default function SkillsPage() {
  return (
    <>
      <SkillsHero />
      <SkillsThesis />
      <DisciplineChapters />
      <MarkWall />
      <SkillsOutro />
    </>
  );
}
