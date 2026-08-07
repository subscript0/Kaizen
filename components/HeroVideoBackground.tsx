'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

/**
 * Looping ambient backdrop for the hero, scoped to the section (not fixed to
 * the viewport). A light wash keeps text legible without hiding the footage.
 *
 * Sizing differs by breakpoint on purpose: the source is a ~16:9 landscape
 * clip. Forcing `object-cover` across a full mobile viewport (much taller
 * than wide) crops out most of the frame's width to fill the height, leaving
 * only a tight, zoomed-in sliver. Below `sm`, the video instead sits in a
 * shorter top-anchored band close to its native aspect ratio, so the whole
 * scene stays visible, fading into the section's own background beneath it.
 * `sm` and up (wider than tall) get the original full-bleed cover.
 *
 * Autoplay is gated behind a client-only prefers-reduced-motion check so a
 * reduced-motion visitor gets the static poster frame instead of a moving
 * video (the attribute is added post-mount rather than toggled via
 * play()/pause() so it never briefly autoplays first).
 */
export default function HeroVideoBackground() {
  const [canAnimate, setCanAnimate] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { base } = useTheme();
  const isLight = base === 'light';

  // ── The opacity layers are gone, on purpose ──────────────────────────────
  // Two layers used to sit over the footage and hold it back:
  //
  //   1. A flat wash of the page colour at 0.34 (light) / 0.48 (dark).
  //   2. On the light theme only, a SCREEN-blended layer at 0.82 that lifted
  //      the night scene's navy shadows up to paper.
  //
  // Both were removed on request — the clip now plays at full strength. What
  // they were buying was contrast for the hero's type, so two things carry
  // that job alone now: the greyscale filter below (no chroma to fight the
  // nameplate) and the functional bottom scrim in the markup (which keeps the
  // 11px mono metadata rows on near-solid background). If the nameplate ever
  // reads as sitting ON the footage rather than over it, those two are the
  // dials — do not quietly reintroduce a wash.
  //
  // ── Why the footage is greyscale ─────────────────────────────────────────
  // The clip has two hues — navy sky, amber lamp — and on the light theme they
  // were the only chroma on the page, which tinted the whole masthead blue.
  // Desaturating keeps what the clip is actually for (movement and depth
  // behind the nameplate) and drops what read as "too colourful". Dark mode
  // keeps a trace of warmth: on #080808 the clip is nearly silhouette already.
  const videoFilter = isLight
    ? 'grayscale(1) contrast(1.06) brightness(1.04)'
    : 'grayscale(0.85) contrast(1.05)';

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setCanAnimate(!mq.matches);
    const sync = () => setCanAnimate(!mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Belt-and-braces autoplay. The <source> is only added once `canAnimate`
  // flips true, which remounts the element via its key — so the `autoplay`
  // attribute has to win a second time, on an element that mounts mid-session
  // rather than at page load. Some browsers decline that. `play()` is a
  // promise; a rejection here is expected and not an error worth surfacing.
  useEffect(() => {
    if (!canAnimate) return;
    const v = videoRef.current;
    if (!v) return;
    const start = () => { void v.play().catch(() => {}); };
    start();
    v.addEventListener('canplay', start);
    return () => v.removeEventListener('canplay', start);
  }, [canAnimate]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* `isolation: isolate` stays even though the screen-blend layer it was
          added for is gone: it keeps this whole stack compositing against
          itself rather than against the ambient layers the page paints behind
          it, which is what stops the bottom scrim's gradient banding against
          the starfield. */}
      <div
        className="absolute inset-x-0 top-0 h-[52vh] max-h-[520px] sm:inset-0 sm:h-full sm:max-h-none"
        style={{ isolation: 'isolate' }}
      >
        <video
          ref={videoRef}
          key={canAnimate ? 'live' : 'static'}
          poster="/videos/hero-bg-poster.jpg"
          muted
          loop
          playsInline
          autoPlay={canAnimate}
          preload="auto"
          className="h-full w-full object-cover"
          style={{ filter: videoFilter }}
        >
          {canAnimate && <source src="/videos/hero-bg.mp4" type="video/mp4" />}
        </video>

        {/* Functional scrim, and the ONLY overlay left. Not decoration: it
            fades the footage out under the hero's lower metadata rows (stack
            spec, counts) so 11px mono type sits on near-solid background, and
            below `sm` it is what hides the video band's hard bottom edge —
            without it the band ends in a visible horizontal cut across the
            page. It does not touch the top of the frame, so the clip is at
            full strength everywhere the nameplate actually sits. */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[hsl(var(--background))] to-transparent sm:h-[55%]" />
      </div>
    </div>
  );
}
