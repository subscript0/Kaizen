import type { Metadata } from 'next';
import ProjectsHero from '@/components/projects/ProjectsHero';
import Projects from '@/components/Projects';
import CaseStudyStage from '@/components/projects/CaseStudyStage';
import WorkNote from '@/components/projects/WorkNote';
import GitHubStats from '@/components/GitHubStats';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Four products built end-to-end — the index, the screens at full size, and what has been shipping on GitHub.',
};

/**
 * /projects, read top to bottom — the same reading order /about uses, applied
 * to the work instead of the person:
 *
 *   ProjectsHero    the masthead, then the thesis and a ledger of numbers that
 *                   count up — all above the fold, no runway
 *   Projects        the index: four rows against a sticky plate that cross-fades
 *                   to whichever project you are reading, with a scrubbed
 *                   progress meter (degrades to thumbnailed rows below `lg`)
 *   CaseStudyStage  the gallery: a pinned stage giving each screen the whole
 *                   viewport, captions rising as the frames dissolve
 *   WorkNote        a pinned statement that lights word by word as you scroll,
 *                   closing on the spec band it is evidence for
 *   GitHubStats     the open-source ledger (count-ups + contribution calendar),
 *                   and the end of the page — there is no site footer anywhere
 *                   on this site
 *
 * Both remaining pinned sections (the gallery, the note) are `position: sticky`
 * inside a tall runway. Nothing on this page listens for `wheel` or calls
 * `window.scrollTo` — the document scrolls normally the whole way down, which is
 * what keeps keyboard, touch, scrollbar dragging and find-in-page working.
 *
 * The masthead carries its own top padding to clear the floating navbar (top on
 * desktop, a fixed bar at the bottom on mobile — which is why every section here
 * holds its content clear of the last 80px).
 */
export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <Projects />
      <CaseStudyStage />
      <WorkNote />
      <GitHubStats />
    </>
  );
}
