'use client';

import { useEffect } from 'react';

/**
 * Site-wide magnetic hover. Mounted ONCE in the root layout; every button that
 * wants the effect just carries `data-magnetic`.
 *
 * ── Why one controller instead of a wrapper component ──────────────────────
 *
 * The obvious shape is a <Magnetic> wrapper around each button (that component
 * still exists and is used in a couple of places). Two problems at this scale:
 *
 *  1. It adds a real element to the DOM. Wrapping a `w-full` submit button or a
 *     flex row item in an `inline-block` div silently breaks the layout, and
 *     there are ~28 of these across the site.
 *  2. Each instance registers its OWN window `mousemove` listener and its own
 *     rAF loop. Twenty-eight of those run twenty-eight rect measurements per
 *     frame whether or not the pointer is anywhere near them.
 *
 * This is one listener and one loop for the whole page, and it touches nothing
 * about the markup — the attribute is inert until this mounts.
 *
 * ── Why a custom property instead of writing `transform` ───────────────────
 *
 * The button system already owns `transform`: `.btn:active` presses to
 * `scale(0.97)`. An inline `transform` from JS would win the cascade and kill
 * that press feedback. Writing the offset to `--mx`/`--my` and letting CSS apply
 * it through the independent `translate` property means the two compose instead
 * of fighting — magnetic pull and press-scale both survive.
 */

/** How strongly the button follows the pointer. */
const STRENGTH = 0.28;
/** Extra px beyond the button's own box where the pull starts. */
const REACH = 80;
/** Lerp factor — lower is heavier. */
const EASE = 0.16;
/** Below this, snap to rest and stop the loop. */
const REST = 0.05;

interface State {
  cx: number;
  cy: number;
  tx: number;
  ty: number;
  lifted: boolean;
}

export default function MagneticField() {
  useEffect(() => {
    // A magnetic button that dodges the pointer is hostile on touch (there is
    // no hover to preview it) and is exactly the kind of motion that reduced
    // motion asks us to drop.
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    let els: HTMLElement[] = [];
    const state = new WeakMap<HTMLElement, State>();
    let px = -1e6;
    let py = -1e6;
    let raf = 0;
    let enabled = false;

    const stateOf = (el: HTMLElement) => {
      let s = state.get(el);
      if (!s) {
        s = { cx: 0, cy: 0, tx: 0, ty: 0, lifted: false };
        state.set(el, s);
      }
      return s;
    };

    const release = (el: HTMLElement, s: State) => {
      el.style.removeProperty('--mx');
      el.style.removeProperty('--my');
      if (s.lifted) {
        el.style.removeProperty('will-change');
        s.lifted = false;
      }
    };

    const frame = () => {
      raf = 0;
      let busy = false;

      for (const el of els) {
        const s = stateOf(el);
        const r = el.getBoundingClientRect();

        // A detached or display:none element measures 0×0 — skip it rather
        // than divide its way to NaN.
        if (r.width === 0 && r.height === 0) {
          s.tx = 0;
          s.ty = 0;
        } else {
          const dx = px - (r.left + r.width / 2);
          const dy = py - (r.top + r.height / 2);
          const reach = Math.max(r.width, r.height) / 2 + REACH;
          const near = Math.hypot(dx, dy) < reach;
          s.tx = near ? dx * STRENGTH : 0;
          s.ty = near ? dy * STRENGTH : 0;
        }

        s.cx += (s.tx - s.cx) * EASE;
        s.cy += (s.ty - s.cy) * EASE;

        const moving = Math.abs(s.tx - s.cx) > REST || Math.abs(s.ty - s.cy) > REST;
        const displaced = Math.abs(s.cx) > REST || Math.abs(s.cy) > REST;

        if (moving || displaced) {
          if (!s.lifted) {
            // Promote only while it is actually moving. Leaving `will-change`
            // on ~28 buttons permanently would hand the compositor 28 layers
            // it has no use for.
            el.style.willChange = 'translate';
            s.lifted = true;
          }
          el.style.setProperty('--mx', `${s.cx.toFixed(2)}px`);
          el.style.setProperty('--my', `${s.cy.toFixed(2)}px`);
          busy = true;
        } else if (s.cx !== 0 || s.cy !== 0 || s.lifted) {
          s.cx = 0;
          s.cy = 0;
          release(el, s);
        }
      }

      if (busy) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && enabled) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };

    // The pointer keeps its screen position while the page moves underneath it,
    // so a scroll changes which buttons are in reach even with no pointermove.
    const onScroll = () => kick();

    const collect = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    };

    // Route changes swap the whole subtree; without this the list goes stale
    // and the effect silently dies after the first client-side navigation.
    const mo = new MutationObserver(() => {
      const before = els;
      collect();
      for (const el of before) {
        if (!el.isConnected) continue;
        if (!els.includes(el)) release(el, stateOf(el));
      }
    });

    const enable = () => {
      if (enabled) return;
      enabled = true;
      collect();
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      mo.observe(document.body, { childList: true, subtree: true });
    };

    const disable = () => {
      if (!enabled) return;
      enabled = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      mo.disconnect();
      cancelAnimationFrame(raf);
      raf = 0;
      for (const el of els) {
        const s = stateOf(el);
        s.cx = 0;
        s.cy = 0;
        release(el, s);
      }
    };

    const sync = () => (fine.matches && !still.matches ? enable() : disable());

    sync();
    fine.addEventListener('change', sync);
    still.addEventListener('change', sync);

    return () => {
      fine.removeEventListener('change', sync);
      still.removeEventListener('change', sync);
      disable();
    };
  }, []);

  return null;
}
