import { Skeleton, SkeletonCard, SkeletonMicro, SkeletonPageHeader } from '@/components/ui/skeleton';

/**
 * /guestbook — header, mood tally, the wall, then the sign form.
 *
 * The wall itself has a SECOND skeleton, inside GuestbookSection: this one
 * covers the route chunk arriving, that one covers `/api/guestbook` answering.
 * They are deliberately the same shape, so the hand-off between them is not
 * visible as a change of layout.
 */
export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="pb-[max(120px,calc(104px+env(safe-area-inset-bottom)))] pt-10 md:pb-24 md:pt-16"
    >
      <div className="measure">
        <div className="mx-auto w-full max-w-[980px]">
          <SkeletonPageHeader pad="pt-0" />

          {/* Mood tally — six columns of glyph / figure / label. */}
          <div className="rule-t mt-10 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <SkeletonMicro className="w-28" />
              <SkeletonMicro className="w-16" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-x-4 gap-y-5 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-start gap-1">
                  <Skeleton className="h-7 w-7 md:h-8 md:w-8" />
                  <Skeleton className="h-6 w-8 md:h-7 md:w-10" />
                  <SkeletonMicro className="w-14" />
                </div>
              ))}
            </div>
          </div>

          {/* The wall — CSS columns, same as the real one. */}
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="mb-4 break-inside-avoid">
                <SkeletonCard lines={i % 3 === 0 ? 4 : 2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
