import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-panel border border-dashed border-border rounded-md py-12 px-6 text-center",
        className,
      )}
    >
      {icon && <div className="text-text-4 mb-3 inline-flex">{icon}</div>}
      <div className="text-[14px] font-semibold text-text-1">{title}</div>
      {description && (
        <p className="mt-1.5 text-[12.5px] text-text-3 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
