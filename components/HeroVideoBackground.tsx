'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Looping backdrop for the hero, scoped to the section (not fixed to the
 * viewport). Plays at full opacity in its original colour — the hero is a
 * dark block in both themes (`.hero-media` in globals.css), so legibility
 * comes from the type being light rather than from dimming the footage.
 *
 * This component no longer reads the theme at all, which is the point: there
 * is nothing left in here that differs between light and dark.
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

  // ── Nothing is applied to the footage any more ───────────────────────────
  // Three things used to hold this clip back, and all three are gone:
  //
  //   1. A flat wash of the page colour at 0.34 (light) / 0.48 (dark).
  //   2. On the light theme, a SCREEN-blended layer at 0.82 that lifted the
  //      night scene's navy shadows up to paper.
  //   3. A `grayscale()` filter, which existed because the clip's navy sky and
  //      amber lamp were the only chroma on the light theme and tinted the
  //      whole masthead blue.
  //
  // The clip now plays at full opacity in its original colour. What made that
  // possible is that the hero is no longer a light-theme surface at all: the
  // section carries `.hero-media` (see globals.css), which makes it a dark
  // block in BOTH themes and re-points the type tokens to their dark-mode
  // values. So contrast is bought by the type being light, rather than by the
  // footage being held down — which is why the wash and the filter are not
  // needed and must not be reintroduced.

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
        >
          {canAnimate && <source src="/videos/hero-bg.mp4" type="video/mp4" />}
        </video>

        {/* Functional scrim, and the ONLY overlay left. Not decoration: it
            fades the footage out under the hero's lower metadata rows (stack
            spec, counts) so 11px mono type sits on near-solid ground, and
            below `sm` it is what hides the video band's hard bottom edge —
            without it the band ends in a visible horizontal cut across the
            page. It does not touch the top of the frame, so the clip is at
            full strength everywhere the nameplate actually sits.

            It fades to `--hero-surface`, NOT to `--background`. Inside
            `.hero-media` those now resolve to the same dark value, but naming
            the hero token is the honest reference: what the footage has to
            blend into is the hero's own surface, and that is dark even when
            the rest of the page is paper. */}
        {/* Mobile is a PERCENTAGE, not the old fixed `h-24`. 96px of fade at
            the foot of a ~440px band left the "full-stack developer / 3+ yrs"
            row sitting on the brightest part of the frame (the sunlit flowers)
            with barely any scrim under it — the one place light grey type had
            nothing to hold on to. Matching desktop's proportion fixes it at
            every phone height instead of at one. */}
        <div
          className="absolute inset-x-0 bottom-0 h-[45%] sm:h-[55%]"
          style={{
            backgroundImage:
              'linear-gradient(to top, hsl(var(--hero-surface)), transparent)',
          }}
        />
      </div>
    </div>
  );
}
