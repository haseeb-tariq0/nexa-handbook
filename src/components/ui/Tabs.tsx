"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TabItem = {
  value: string;
  label: string;
  disabled?: boolean;
  hint?: string;
};

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[];
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-0.5 bg-panel-2 border border-border rounded-md p-0.5",
        className,
      )}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            type="button"
            disabled={it.disabled}
            onClick={() => !it.disabled && onChange(it.value)}
            aria-selected={active}
            title={it.hint}
            className={cn(
              "px-3 py-1.5 text-[12px] font-medium rounded transition whitespace-nowrap",
              active
                ? "bg-panel text-text-1 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                : "text-text-3 hover:text-text-1",
              it.disabled && "opacity-50 cursor-not-allowed hover:text-text-3",
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
