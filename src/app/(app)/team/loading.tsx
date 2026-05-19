import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-7">
        <Skeleton className="h-6 w-56 mb-3" />
        <Skeleton className="h-3 w-96 max-w-full" />
      </div>
      <div className="mb-5 flex justify-between">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-panel border border-border rounded-md p-5 text-center"
          >
            <Skeleton className="h-[52px] w-[52px] rounded-full mx-auto mb-2.5" />
            <Skeleton className="h-3 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-2.5 w-1/2 mx-auto mb-3" />
            <Skeleton className="h-2 w-1/3 mx-auto mb-3" />
            <div className="flex justify-center gap-1.5 pt-3 border-t border-border">
              <Skeleton className="h-6 w-14 rounded" />
              <Skeleton className="h-6 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
