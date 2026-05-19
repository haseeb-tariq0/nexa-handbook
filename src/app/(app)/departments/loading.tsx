import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-7">
        <Skeleton className="h-6 w-44 mb-3" />
        <Skeleton className="h-3 w-96 max-w-full" />
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-panel border border-border rounded-md p-4 min-h-[140px]"
          >
            <Skeleton className="h-8 w-8 rounded-md mb-3" />
            <Skeleton className="h-3 w-3/4 mb-2" />
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2 w-1/2 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
