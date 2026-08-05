import type { Metadata } from 'next';
import ContactHero from '@/components/contact/ContactHero';
import Contact from '@/components/Contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Services, availability, and every way to reach me — let\'s build something.',
};

/**
 * /contact, read top to bottom:
 *
 *   ContactHero   a plate of motion that opens to full bleed as you scroll,
 *                 then the brief and a ledger of numbers that count up
 *   Contact       02 the services, told against a sticky plate that shows
 *                 whichever one you are reading
 *                 03 a pinned statement that lights word by word
 *                 04 the connect lockup and the three promises
 *                 05 the working form
 *
 * The page ends there. There is no site footer anywhere on this site — the
 * mobile nav is a fixed bottom bar and `main` reserves its 80px band in
 * `app/globals.css`, so the last section still clears it.
 *
 * Both pinned sections are `position: sticky` inside a tall runway. Nothing on
 * this page listens for `wheel` or calls `window.scrollTo` — the document
 * scrolls normally the whole way down, which is what keeps keyboard, touch,
 * scrollbar dragging and find-in-page working.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <Contact />
    </>
  );
}
