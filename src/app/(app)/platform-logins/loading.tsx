import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-7">
        <Skeleton className="h-6 w-56 mb-3" />
        <Skeleton className="h-3 w-96 max-w-full" />
      </div>
      <Skeleton className="h-14 w-full mb-6 rounded-md" />
      <div className="flex gap-1.5 mb-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-panel border border-border rounded-md overflow-hidden">
            <Skeleton className="h-[3px] w-full" />
            <div className="p-5">
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-2.5 w-2/3 mb-4" />
              <Skeleton className="h-2.5 w-full mb-1.5" />
              <Skeleton className="h-2.5 w-3/4 mb-4" />
              <Skeleton className="h-2.5 w-full mb-1.5" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
