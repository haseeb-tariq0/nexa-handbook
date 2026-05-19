import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-panel-2 rounded",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.4s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: `${80 + (i % 3) * 7}%` }}
        />
      ))}
    </div>
  );
}
