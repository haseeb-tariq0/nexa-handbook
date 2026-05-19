import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-7">
        <Skeleton className="h-6 w-48 mb-3" />
        <Skeleton className="h-3 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-panel border border-border rounded-md p-5 min-h-[140px]"
          >
            <Skeleton className="h-8 w-8 rounded-md mb-3" />
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-2.5 w-full mb-1.5" />
            <Skeleton className="h-2.5 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
