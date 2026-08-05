import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    /**
     * Deliberately empty, and it is load-bearing — read this before pasting in
     * a component from a gallery.
     *
     * `next/image` refuses any `src` whose host is not listed here and throws
     * at request time ("hostname is not configured under images"). Every
     * drop-in hero component in the wild ships with Unsplash / uploadthing /
     * cdn.* placeholders, so the first render after pasting one is a 500, not a
     * broken image. The fix is to point the component at something under
     * `/public` (see `components/about/AboutHero.tsx`, which uses
     * `/videos/hero-bg.mp4` and `/videos/hero-bg-poster.jpg`), NOT to widen
     * this list — the portfolio owns its own assets and should not depend on
     * a third-party CDN staying up to render its own face.
     */
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
