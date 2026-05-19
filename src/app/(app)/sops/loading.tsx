import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-7">
        <Skeleton className="h-6 w-72 mb-3" />
        <Skeleton className="h-3 w-96 max-w-full" />
      </div>
      <div className="mb-4 flex gap-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-32 self-center" />
      </div>
      <div className="flex gap-1.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>
      <div className="bg-panel border border-border rounded-md overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_180px_180px_120px] gap-4 px-5 py-3.5 border-b border-border last:border-b-0"
          >
            <div>
              <Skeleton className="h-3 w-3/4 mb-1.5" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
            <Skeleton className="h-3 w-24 self-center" />
            <Skeleton className="h-3 w-32 self-center" />
            <Skeleton className="h-3 w-16 justify-self-end self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}
