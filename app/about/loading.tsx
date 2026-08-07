import { SkeletonMasthead, SkeletonSection } from '@/components/ui/skeleton';

/** /about — masthead, then the bio, manifesto, thinking and experience blocks. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <SkeletonMasthead />
      <SkeletonSection lines={5} />
      <SkeletonSection lines={4} />
      <SkeletonSection lines={3} />
    </div>
  );
}
