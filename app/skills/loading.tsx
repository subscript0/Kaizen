import { Skeleton, SkeletonMasthead, SkeletonSection } from '@/components/ui/skeleton';

/**
 * /skills — masthead, thesis, the discipline chapters, then the mark wall.
 *
 * The wall is the reason this file is worth having: it is a dense grid of
 * uniform tiles, so a blank frame there is a large empty rectangle rather than
 * a briefly-missing paragraph.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <SkeletonMasthead />
      <SkeletonSection lines={4} />

      <div className="measure py-16">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton key={i} ruled className="aspect-square" />
          ))}
        </div>
      </div>
    </div>
  );
}
