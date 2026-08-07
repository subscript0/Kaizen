import { Skeleton, SkeletonMicro, SkeletonPageHeader } from '@/components/ui/skeleton';

/** /blog — the header, then the "in the queue" list of drafts. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <SkeletonPageHeader lede={3} />

      <div className="measure mt-10">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-48" />
          <Skeleton className="h-11 w-36" />
        </div>
      </div>

      <div className="bleed-t mt-16 lg:mt-20">
        <div className="measure pt-10">
          <div className="rule-t mb-8 flex max-w-[22rem] items-baseline justify-between gap-4 pt-3">
            <SkeletonMicro className="w-28" />
            <SkeletonMicro className="w-20" />
          </div>

          <div className="flex flex-col">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rule-t grid grid-cols-1 gap-x-[var(--gutter)] gap-y-3 py-8 md:grid-cols-[4rem_1fr]">
                <SkeletonMicro className="w-8" />
                <div>
                  <Skeleton className="h-6 w-[min(100%,24rem)]" />
                  <Skeleton className="mt-3 h-3.5 w-[min(100%,32rem)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
