import Hero from '@/components/Hero';

/**
 * Home is the introduction and nothing else: who this is, what they do, the
 * stack they work in, and where to reach them.
 *
 * The work index and contact block that briefly lived here were removed on
 * request — both already have dedicated routes (`/projects`, `/contact`), and
 * repeating them on the landing page made the introduction the smaller half of
 * its own page.
 */
export default function Home() {
  return <Hero />;
}
