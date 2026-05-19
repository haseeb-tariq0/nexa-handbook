"use client";

import {
  Palette,
  FileSpreadsheet,
  Shield,
  Compass,
  Users as UsersIcon,
  DollarSign,
  Settings,
  Sparkles,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DOC_CATEGORY_LABELS } from "@/lib/constants";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  brand: Palette,
  templates: FileSpreadsheet,
  policies: Shield,
  onboarding: Compass,
  hr: UsersIcon,
  finance: DollarSign,
  operations: Settings,
  creative: Sparkles,
  ai_tech: Cpu,
};

type CategoryCount = { category: string; count: number };

export function DocumentCategoryHero({
  counts,
  selected,
  onSelect,
}: {
  counts: CategoryCount[];
  selected: string | null;
  onSelect: (cat: string | null) => void;
}) {
  if (counts.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-text-4 font-semibold mb-3">
        Browse by category
      </div>
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        }}
      >
        {counts.map(({ category, count }) => {
          const Icon = CATEGORY_ICON[category] ?? Sparkles;
          const isActive = selected === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(isActive ? null : category)}
              className={cn(
                "group flex items-start gap-3 p-3.5 bg-panel rounded-md border transition text-left",
                isActive
                  ? "border-section-doc shadow-sm"
                  : "border-border hover:border-border-3 hover:-translate-y-0.5 hover:shadow-sm",
              )}
            >
              <span
                className={cn(
                  "h-9 w-9 rounded-md inline-flex items-center justify-center shrink-0 transition",
                  isActive
                    ? "bg-section-doc text-white"
                    : "bg-[#EEF0FB] text-section-doc",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[12.5px] font-semibold text-text-1 truncate">
                  {DOC_CATEGORY_LABELS[category] ?? category}
                </div>
                <div className="text-[10.5px] text-text-3">
                  {count} {count === 1 ? "document" : "documents"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
