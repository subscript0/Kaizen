import { Skeleton, SkeletonMicro, SkeletonText } from '@/components/ui/skeleton';

/**
 * /projects/[slug] — the case study.
 *
 * This is the one route on the site reached from a card the visitor has
 * already looked at, so the shapes here matter more than elsewhere: the hero
 * plate, the three-up problem/solution/result row and the screenshot grid all
 * reserve their real boxes so the article does not resize under the reader
 * while the images decode.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="measure pt-32 lg:pt-40">
      <SkeletonMicro className="w-28" />

      <Skeleton className="mt-6 h-[clamp(2.3rem,6.4vw,4.6rem)] w-[min(100%,34rem)]" />
      <SkeletonText lines={2} className="mt-6 max-w-2xl" />

      <Skeleton ruled className="mt-12 aspect-video w-full" />

      {/* Tech stack chips */}
      <div className="mb-20 mt-20">
        <SkeletonMicro className="mb-4 w-24" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} ruled className="h-8 w-24" />
          ))}
        </div>
      </div>

      {/* Problem / solution / result */}
      <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rule-t rule-b rule-l rule-r p-6">
            <Skeleton className="mb-4 h-8 w-8" />
            <Skeleton className="mb-3 h-5 w-28" />
            <SkeletonText lines={4} />
          </div>
        ))}
      </div>

      {/* Screenshots */}
      <div className="mb-20 grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} ruled className="aspect-video w-full" />
        ))}
      </div>
    </div>
  );
}
