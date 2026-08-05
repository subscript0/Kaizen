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

  // ── Why light mode is not just "a heavier wash" ──────────────────────────
  // The footage is a night scene: deep navy sky, warm amber laptop glow. On the
  // dark theme a flat 0.48 wash of the page colour is all it needs.
  //
  // On the light theme that same approach was cranked to 0.88, and a flat wash
  // is the wrong tool — NORMAL blending pulls every pixel toward the wash
  // colour by the same amount, so the navy and the amber both collapsed onto
  // the same near-grey and the clip turned into the reported "grey smear".
  //
  // SCREEN blending lifts the shadows without touching the highlights:
  //   result = 1 - (1 - base) * (1 - top)
  // The navy sky rises to paper, while the amber glow — already near 1.0 —
  // barely moves. The image stays an image, reads light enough for the hero's
  // near-black type, and keeps the one colour that matches the site's accent.
  // The flat wash then does only the small amount of levelling still needed.
  const washOpacity = isLight ? 0.18 : 0.48;
  const screenLift = 0.72;

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
      {/* `isolation: isolate` is required, not cosmetic: without it the screen
          blend below would composite against whatever the page has painted
          behind this element instead of against the video. */}
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
          style={isLight ? { filter: 'saturate(0.9) contrast(1.05)' } : undefined}
        >
          {canAnimate && <source src="/videos/hero-bg.mp4" type="video/mp4" />}
        </video>

        {/* Light theme only: lift the shadows to paper, keep the highlights. */}
        {isLight && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'hsl(var(--background))',
              mixBlendMode: 'screen',
              opacity: screenLift,
            }}
          />
        )}

        {/* Functional scrim, not decoration: fades the footage out under the
            hero's lower metadata rows (stack spec, counts) so 11px mono type
            sits on near-solid background. Also hides the mobile band's edge. */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[hsl(var(--background))] to-transparent sm:h-[55%]" />
      </div>

      {/* Wash — a flat scrim for text contrast. The decorative top/bottom
          gradient overlay was removed; the only remaining fade is the
          functional one above, which hides the mobile band's hard edge. */}
      <div className="absolute inset-0" style={{ backgroundColor: `hsl(var(--background) / ${washOpacity})` }} />
    </div>
  );
}
