'use client';

import { usePathname } from 'next/navigation';
import { CosmicParallaxBg } from '@/components/ui/parallax-cosmic-background';

/**
 * Mounts the cosmic starfield behind every route except the home page.
 *
 * Home is excluded because its hero already carries the looping video
 * backdrop; running both would stack two moving backgrounds on one screen and
 * make the hero's 11px mono metadata unreadable.
 *
 * Gating here (rather than adding the backdrop to each page) means any route
 * added later inherits it automatically, and the starfield keeps its DOM node
 * across client-side navigations — so the field is generated once instead of
 * re-randomising a thousand box-shadow spots on every route change.
 */
export default function CosmicBackdrop() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return <CosmicParallaxBg variant="ambient" />;
}
