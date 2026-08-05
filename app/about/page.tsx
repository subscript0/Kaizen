import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import AboutMe from '@/components/AboutMe';
import Manifesto from '@/components/about/Manifesto';
import HowIThink from '@/components/HowIThink';
import Experience from '@/components/Experience';
import AboutOutro from '@/components/about/AboutOutro';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Who I am, how I think, and the experience behind the work.',
};

/**
 * /about, read top to bottom:
 *
 *   AboutHero    a plate of motion that opens to full bleed as you scroll,
 *                then the thesis and a ledger of numbers that count up
 *   AboutMe      three chapters against a sticky portrait plate that names
 *                whichever one you are reading
 *   Manifesto    a pinned statement that lights word by word as you scroll
 *   HowIThink    the four principles (owned elsewhere)
 *   Experience   the career list (owned elsewhere)
 *   AboutOutro   the contact lockup and the terminal band
 *
 * Both pinned sections (AboutHero, Manifesto) are `position: sticky` inside a
 * tall runway. Nothing on this page listens for `wheel` or calls
 * `window.scrollTo` — the document scrolls normally the whole way down, which
 * is what keeps keyboard, touch, scrollbar dragging and find-in-page working.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMe />
      <Manifesto />
      <HowIThink />
      <Experience />
      <AboutOutro />
    </>
  );
}
