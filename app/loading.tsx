import { Skeleton, SkeletonMicro, SkeletonText } from '@/components/ui/skeleton';

/**
 * Home. Mirrors `components/Hero.tsx`: a bleeding spec rule with metadata
 * straddling it, then the name at display size over a 12-column grid.
 *
 * ── Why every route has one of these ───────────────────────────────────────
 * A `loading.tsx` wraps its segment in a Suspense boundary, which is what lets
 * Next start streaming a route's shell before the segment's JS has arrived.
 * These pages are statically rendered, so on a warm connection the file is
 * barely on screen — the case it exists for is the cold one: a first visit on
 * mobile data, where the alternative is the browser sitting on the previous
 * page with no acknowledgement that the tap registered.
 *
 * It also stops the route-transition wipe in `app/template.tsx` from being the
 * only feedback. That wipe is fixed at ~440ms and then clears whether or not
 * the page behind it is ready; on a slow chunk it used to clear onto nothing.
 */
export default function Loading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading"
      className="relative w-full overflow-hidden pb-[calc(6rem+env(safe-area-inset-bottom))] pt-24 sm:pt-28 md:pb-0"
    >
      <div className="relative z-10 flex min-h-[calc(100dvh-11rem)] flex-col md:min-h-[calc(100dvh-7rem)]">
        <div className="bleed-b">
          <div className="measure flex items-baseline justify-between gap-4 py-3">
            <SkeletonMicro className="w-36" />
            <SkeletonMicro className="w-40" />
          </div>
        </div>

        <div className="measure flex flex-1 flex-col justify-center pb-12 pt-10 sm:pt-14">
          <div className="grid-12 items-start">
            <div className="col-span-4 min-[769px]:col-span-7">
              {/* `.text-display` — clamp(2.5rem, 7vw, 5.75rem) at 0.92. */}
              <Skeleton className="h-[clamp(2.3rem,6.4vw,5.3rem)] w-full max-w-[38rem]" />
              <Skeleton className="mt-3 h-[clamp(2.3rem,6.4vw,5.3rem)] w-[72%] max-w-[28rem]" />
              <SkeletonText lines={2} className="mt-8 max-w-xl" />

              <div className="mt-10 flex flex-wrap gap-3">
                <Skeleton className="h-12 w-44" />
                <Skeleton className="h-12 w-36" />
              </div>
            </div>

            <div className="col-span-4 mt-12 min-[769px]:col-span-5 min-[769px]:mt-0">
              <div className="rule-t flex items-baseline justify-between gap-4 pt-3">
                <SkeletonMicro className="w-28" />
                <SkeletonMicro className="w-12" />
              </div>
              <div className="mt-5 flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rule-b flex items-baseline justify-between gap-4 pb-3">
                    <SkeletonMicro className="w-32" />
                    <SkeletonMicro className="w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
