'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useIsoLayoutEffect } from '@/lib/motion';

/**
 * Route transition — a cubic turn.
 *
 * `template.tsx` remounts on every navigation, so each new route starts with a
 * full-viewport panel already covering it. That panel is one face of a cube:
 * it is hinged along the TOP edge of the screen and turns away from the viewer
 * on the X axis, lifting off like a lid to reveal the incoming page, which is
 * itself turning in on the same axis from the opposite direction. The
 * destination's name sits centred in mono underneath while the face clears.
 *
 * The face drags a hairline accent rule along its trailing edge — the same 1px
 * the entire site is drawn with, briefly given somewhere to go. Through a 3D
 * turn that rule is the only element that stays geometrically sharp, so it is
 * what the eye actually tracks.
 *
 * Geometry (perspective, hinge, the trailing rule) lives in `.cube-stage` /
 * `.cube-face` in app/globals.css; this file owns only the timeline and the
 * failure contract below.
 *
 * ── Mobile ──
 * The face is fine at any width: it is `position: fixed` inside a stage that
 * clips, so its mid-turn sweep cannot reach the document. The CONTENT tilt is
 * not — a rotateX on the page wrapper expands the scrollable overflow area,
 * which on a phone shows up as the page twitching its scroll height on every
 * navigation. So the tilt is desktop-only (`MOBILE_Q`); below that breakpoint
 * the content keeps the plain vertical rise it always had.
 *
 * ── The three rules this had to satisfy ──────────────────────────────────
 *
 * 1. FAST. A visitor sees this on every single click, and anything they see
 *    that often reads as latency, not as craft. The bands are fully clear of
 *    the viewport in ~420ms; the old transition ran ~1500ms.
 *
 * 2. NEVER BLOCKS INPUT. The old stage held `pointer-events: auto` for its
 *    entire run, so the site was dead to clicks for a second and a half after
 *    every navigation. This one accepts pointer events only while the bands
 *    genuinely cover the page (~90ms, so a stray click cannot land on a link
 *    the visitor cannot see) and releases them the moment the wipe starts.
 *
 * 3. FAILS VISIBLE. This is the important one. The version this replaces
 *    rendered `{children}` at inline `opacity: 0` in the server HTML and
 *    relied entirely on a GSAP timeline to bring it back. Any break in that
 *    one path — a thrown error, an interrupted navigation, a backgrounded tab
 *    where requestAnimationFrame is throttled and GSAP simply never ticks —
 *    left the whole site invisible behind a click-blocking overlay, and there
 *    was no second path to recover it.
 *
 *    Four things changed:
 *
 *      · The content entrance is TRANSFORM ONLY. Nothing in this file can set
 *        the page's opacity to 0, so no failure can hide it. The worst case a
 *        dead JS path can produce is a page sitting 16px lower than it should.
 *      · The overlay is `display: none` in the markup and switched on by
 *        script. No JS means no overlay at all, rather than an overlay with
 *        nothing to remove it.
 *      · A backgrounded tab is detected up front (`visibilityState`) and skips
 *        the animation entirely, because that is the case where rAF-driven
 *        motion cannot be trusted to complete.
 *      · Everything runs inside try/catch, behind a watchdog timer, with the
 *        same `reveal()` on the unmount path. Four independent routes to a
 *        visible page.
 */

// 0.05s lead-in + 0.4s turn ⇒ the face is clear of the viewport at 450ms, the
// same budget the five-band wipe this replaces ran to. The viewport stops
// being *covered* much earlier, at roughly the halfway point of the turn.
const FACE_DURATION = 0.4;
const FACE_ANGLE = -92; // deg. Past 90 so the face is edge-on then gone, not hanging flat.
const CONTENT_RISE = 16; // px
const CONTENT_TILT = 6; // deg — desktop only, see the header note
const PERSPECTIVE = 1200; // px, matched to `.cube-stage`'s own perspective
const MOBILE_Q = '(max-width: 767.98px)';
const BLOCK_MS = 90; // pointer events swallowed only while genuinely opaque
const WATCHDOG_MS = 1200;

/**
 * The route this template last ran for. Module scope, so it survives remounts
 * but resets on a hard reload, and it answers two questions at once:
 *
 *  · `null` ⇒ this is the initial page load. A full-bleed wipe on arrival is
 *    pure delay in front of the thing the visitor came for, so the first paint
 *    is never transitioned. (This used to be justified by the Preloader
 *    covering that moment; the Preloader is gone and the rule is now simply
 *    that nothing should stand between arriving and reading.)
 *  · unchanged ⇒ the component remounted without the route changing, which is
 *    what React Strict Mode's double-invoke looks like in development. Not a
 *    navigation, so not a transition.
 */
let lastPath: string | null = null;

function routeLabel(pathname: string): string {
  if (!pathname || pathname === '/') return 'Index';
  const last = pathname.split('/').filter(Boolean).pop() ?? 'Index';
  return last.replace(/[-_]/g, ' ');
}

export default function Template({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    const stage = stageRef.current;
    const face = faceRef.current;
    const label = labelRef.current;
    const content = contentRef.current;
    if (!content) return;

    let watchdog = 0;
    let done = false;

    /**
     * The one function that matters: page on screen, overlay out of the way,
     * no inline residue left behind.
     */
    const reveal = () => {
      if (done) return;
      done = true;
      clearTimeout(watchdog);
      document.removeEventListener('visibilitychange', onHide);
      if (stage) {
        stage.style.display = 'none';
        stage.style.pointerEvents = 'none';
      }
      // `clearProps`, not `set({ y: 0 })`. GSAP leaves `transform:
      // translate(0px, 0px)` behind after a y-tween, and ANY transform other
      // than `none` makes this wrapper a stacking context — which traps every
      // overlay a page renders inside it. Wiping the inline styles is what
      // lets a page-level drawer or modal reach the root stacking context.
      gsap.set(content, { clearProps: 'all' });
      content.style.removeProperty('transform');
      content.style.removeProperty('will-change');
    };

    function onHide() {
      // A tab that goes to the background stops getting animation frames. Do
      // not leave the page mid-transition waiting for a tick that isn't coming.
      if (document.visibilityState !== 'visible') reveal();
    }

    try {
      const isNavigation = lastPath !== null && lastPath !== pathname;
      lastPath = pathname;

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hidden = document.visibilityState !== 'visible';

      // Nothing to animate over: the first paint is never transitioned, a
      // hidden tab cannot be trusted to tick, and either way the page must
      // just be there.
      if (!isNavigation || hidden || !stage || !face || !label) {
        reveal();
        return;
      }

      watchdog = window.setTimeout(reveal, WATCHDOG_MS);
      document.addEventListener('visibilitychange', onHide);

      // Switched on here rather than in the markup, so the server HTML never
      // contains a viewport-covering panel that JS is then required to remove.
      stage.style.display = 'block';
      stage.style.pointerEvents = 'auto';

      if (reduce) {
        // Fade only. No turn, no tilt, no rise on the content — a rotating
        // plane filling the viewport is precisely the vestibular trigger this
        // preference exists for. Just the covering colour dissolving off.
        gsap.set(face, { rotationX: 0 });
        gsap.set(label, { opacity: 0 });
        stage.style.pointerEvents = 'none';
        const tl = gsap.timeline({ onComplete: reveal });
        tl.to(stage, { opacity: 0, duration: 0.2, ease: 'none' });
        return () => {
          clearTimeout(watchdog);
          tl.kill();
          stage.style.opacity = '1';
          reveal();
        };
      }

      // A phone gets the turn on the overlay but not on the page beneath it.
      const isMobile = window.matchMedia(MOBILE_Q).matches;

      gsap.set(face, { rotationX: 0, transformOrigin: '50% 0%' });
      gsap.set(label, { opacity: 0, y: 5 });
      // Transform only — see the header. The page is never hidden.
      gsap.set(content, {
        y: CONTENT_RISE,
        willChange: 'transform',
        ...(isMobile
          ? {}
          : {
              rotationX: CONTENT_TILT,
              transformOrigin: '50% 100%',
              transformPerspective: PERSPECTIVE,
            }),
      });

      const tl = gsap.timeline({ onComplete: reveal });

      tl
        // The destination announces itself, then gets out of the way.
        .to(label, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0)
        .call(
          () => {
            stage.style.pointerEvents = 'none';
          },
          undefined,
          BLOCK_MS / 1000,
        )
        // The face turns away on its top hinge. `power4.inOut` keeps it flat
        // and opaque for the first third — that is what covers the swap — then
        // takes it edge-on and gone in a hurry.
        .to(
          face,
          { rotationX: FACE_ANGLE, duration: FACE_DURATION, ease: 'power4.inOut' },
          0.05,
        )
        .to(label, { opacity: 0, duration: 0.13, ease: 'power1.in' }, 0.1)
        .to(
          content,
          {
            y: 0,
            ...(isMobile ? {} : { rotationX: 0 }),
            duration: 0.42,
            ease: 'power3.out',
          },
          0.08,
        );

      return () => {
        clearTimeout(watchdog);
        tl.kill();
        reveal(); // never unmount leaving the next route shifted or covered
      };
    } catch (err) {
      // Failure contract: log, then get out of the way. A transition that
      // breaks must never be able to leave the page covered or shifted.
      console.error('[Template] transition failed, revealing the page anyway:', err);
      reveal();
    }
    // Re-runs on every navigation because `template.tsx` remounts; the
    // pathname is read fresh each time for the label.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={stageRef}
        aria-hidden="true"
        className="cube-stage z-[9995]"
        style={{ display: 'none', pointerEvents: 'none' }}
      >
        {/* One face, hinged along the top edge. Geometry is in `.cube-face`;
            the accent hairline on its trailing edge is that rule's ::after. */}
        <div ref={faceRef} className="cube-face" />

        <div
          ref={labelRef}
          className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center px-[var(--gutter)] font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em]"
          style={{ color: 'hsl(var(--foreground-muted))' }}
        >
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            />
            {routeLabel(pathname)}
          </span>
        </div>
      </div>

      <div ref={contentRef}>{children}</div>
    </>
  );
}
