'use client';

import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { isSoundEnabled, playClick, setSoundEnabled, subscribeSound } from '@/lib/sound';

/** `useLayoutEffect` warns during SSR; this reads the stored preference before
 *  first paint on the client and falls back to `useEffect` on the server. */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Everything that should tick. Links included — nav, project cards, socials. */
const INTERACTIVE = 'button, a[href], [role="button"], summary, [data-sound]';

function shouldSound(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const el = target.closest(INTERACTIVE);
  if (!el) return false;
  // Opt-out hatch, used by the toggle itself (which plays its own confirmation).
  if (el.closest('[data-no-sound]')) return false;
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
  return true;
}

/**
 * Global UI click sound + its mute toggle.
 *
 * Wired as ONE delegated listener on `document` rather than per component:
 * every button and link on the site is covered without touching a single
 * component file, and elements added later (route changes, portals, drawers)
 * are covered automatically.
 *
 * `pointerdown` is the trigger, not `click`: it fires once per physical press,
 * before navigation tears the page down — a `click` listener frequently loses
 * the race on an `<a href>` and the sound gets cut off mid-envelope. Keyboard
 * activation is handled separately since it produces no pointer event.
 */
export default function SoundProvider() {
  const [on, setOn] = useState(true); // matches the SSR default; corrected below
  const [mounted, setMounted] = useState(false);

  useIsoLayoutEffect(() => {
    setOn(isSoundEnabled());
    setMounted(true);
    return subscribeSound(setOn);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      // isTrusted rules out programmatic .click() calls (carousels, analytics,
      // the reveal helpers) — those must never make noise.
      if (!e.isTrusted) return;
      if (e.button !== 0) return; // primary press only; no right/middle click
      if (!shouldSound(e.target)) return;
      playClick();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.isTrusted) return;
      if (e.repeat) return; // held key must not machine-gun
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      if (!shouldSound(e.target)) return;
      playClick();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = !isSoundEnabled();
    setSoundEnabled(next);
    // Turning it ON confirms itself audibly. This call is inside the click
    // handler, i.e. inside the user gesture, which is the only moment a
    // browser will let the AudioContext start.
    if (next) playClick();
  }, []);

  // Before mount we render the SSR default (on) so server and client markup
  // match; the layout effect corrects it in the same frame.
  const isOn = !mounted || on;

  return (
    <button
      type="button"
      data-no-sound
      onClick={toggle}
      aria-pressed={isOn}
      aria-label={isOn ? 'Mute interface sound' : 'Unmute interface sound'}
      title={isOn ? 'Interface sound is on — click to mute' : 'Interface sound is off — click to unmute'}
      className="sound-toggle"
      data-on={isOn ? 'true' : 'false'}
      suppressHydrationWarning
    >
      {/* Square-cornered speaker, drawn to the same hairline weight as every
          other rule on the site. A slash instead of the arc when muted. */}
      <svg
        className="sound-toggle__icon"
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        aria-hidden="true"
      >
        <path d="M2 6h2.5L8 3v10L4.5 10H2z" />
        {isOn ? (
          <>
            <path d="M10.5 6.2a2.6 2.6 0 0 1 0 3.6" />
            <path d="M12.4 4.4a5.2 5.2 0 0 1 0 7.2" />
          </>
        ) : (
          <path d="M11 6l4 4M15 6l-4 4" />
        )}
      </svg>
      <span className="sound-toggle__label">Sound {isOn ? 'On' : 'Off'}</span>
    </button>
  );
}
