import {
  Skeleton,
  SkeletonMasthead,
  SkeletonMicro,
  SkeletonStatRow,
  SkeletonText,
} from '@/components/ui/skeleton';

/**
 * /projects — masthead, the work index, then the GitHub ledger.
 *
 * The index rows carry a 16:9 plate each, which is the largest reserved box
 * anywhere on the site; getting its aspect ratio right here is what keeps the
 * page from jumping a screen-height when the real images decode.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <SkeletonMasthead />

      <div className="measure py-16">
        <div className="flex flex-col gap-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-6 md:grid-cols-2">
              <Skeleton ruled className="aspect-video w-full" />
              <div>
                <SkeletonMicro className="w-24" />
                <Skeleton className="mt-4 h-8 w-[min(100%,18rem)]" />
                <SkeletonText lines={3} className="mt-5" />
                <div className="mt-6 flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((__, j) => (
                    <Skeleton key={j} ruled className="h-7 w-20" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="measure py-16">
        <SkeletonMicro className="mb-8 w-32" />
        <SkeletonStatRow />
        <Skeleton ruled className="h-[158px] w-full" />
      </div>
    </div>
  );
}
