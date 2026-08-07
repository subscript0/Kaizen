'use client';

import { useEffect, useRef } from 'react';

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
 * ── The reduced-motion gate is CSS, not JavaScript, and that is the point ──
 *
 * This used to hold a `canAnimate` state that started false, flipped in a
 * mount effect, and gated BOTH the `autoplay` attribute and the `<source>`
 * child (remounting the element through a changing `key`). The intent was
 * good — a reduced-motion visitor must never see even a frame of movement —
 * but the cost was that the browser could not begin fetching the clip until
 * React had hydrated. Measured on this machine: the element sat with no
 * source for ~9 seconds, then acquired one at ~12.7s and started playing at
 * ~13.5s. On the landing page that reads as "the video does not play".
 *
 * The `media` attribute on `<source>` expresses the same rule declaratively:
 * the browser evaluates it while parsing the HTML, so the fetch starts
 * immediately for everyone else, and a reduced-motion visitor simply never
 * gets a source (networkState 3, poster only) with no frame of movement and
 * no JavaScript involved.
 *
 * The effect below is now only a backstop — see its own note.
 */
export default function HeroVideoBackground() {
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

  // Backstop only — the markup below is what actually starts the video.
  //
  // Two things this still buys:
  //
  //  1. `v.muted = true`. React does not reliably reflect the `muted` prop
  //     onto the DOM property, and Chrome's autoplay policy reads the
  //     PROPERTY, not the attribute. An unmuted video is blocked outright.
  //  2. A `play()` nudge for engines that decline the `autoplay` attribute
  //     but allow a programmatic play on a muted element. `play()` returns a
  //     promise and rejecting is a normal outcome here (no source on a
  //     reduced-motion visitor, for one), so the rejection is swallowed.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // If the engine ignored the `media` gate on <source>, enforce it here so
    // a reduced-motion visitor still ends up on the poster.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      v.pause();
      return;
    }

    v.muted = true;
    const start = () => { void v.play().catch(() => {}); };
    start();
    v.addEventListener('loadeddata', start);
    v.addEventListener('canplay', start);
    return () => {
      v.removeEventListener('loadeddata', start);
      v.removeEventListener('canplay', start);
    };
  }, []);

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
        {/* Everything here is in the SERVER HTML — no `key`, no conditional
            child, nothing waiting on hydration. The browser starts fetching
            the clip while it is still parsing the page. */}
        <video
          ref={videoRef}
          poster="/videos/hero-bg-poster.jpg"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          className="h-full w-full object-cover"
        >
          {/* `media` is the reduced-motion gate, evaluated at parse time. A
              visitor who asks for reduced motion matches nothing here, so the
              element ends up with no source at all (networkState 3) and shows
              the poster — no movement, no JavaScript. Engines that ignore the
              attribute fall through to playing it, which is the safe way for
              this to fail; the effect above catches that case. */}
          <source
            src="/videos/hero-bg.mp4"
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
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
