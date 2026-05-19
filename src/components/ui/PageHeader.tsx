import * as React from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 mb-7">
      <div className="min-w-0 flex-1">
        <h1 className="text-[26px] leading-tight font-semibold text-text-1 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[13.5px] text-text-3 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
