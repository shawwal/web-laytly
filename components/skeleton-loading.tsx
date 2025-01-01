// src/components/skeleton-loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonLoading() {
  return (
    <div>
      <Skeleton className="h-6 w-1/4 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, itemIndex) => (
          <div key={itemIndex} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-5" />
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
