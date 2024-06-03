import { SkeletonCard } from '@/app/ui/skeleton-card';
export default function Loading() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium text-gray-400/80">Завантаження...</h1>

      <div>
        <SkeletonCard isLoading={true} />
      </div>
    </div>
  );
}