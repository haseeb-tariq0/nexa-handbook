"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ListChecks,
  FileText,
  KeyRound,
  Users,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecentUpdate } from "@/lib/queries/home";

const KIND_ICON: Record<RecentUpdate["kind"], React.ComponentType<{ className?: string }>> = {
  sop: ListChecks,
  document: FileText,
  platform_login: KeyRound,
  team_member: Users,
};

type FilterKey = "all" | "sop" | "document" | "platform_login" | "team_member";
type Range = "today" | "7d" | "30d" | "q2";

const FILTERS: { value: FilterKey; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sop", label: "SOPs" },
  { value: "document", label: "Docs" },
  { value: "platform_login", label: "Logins" },
  { value: "team_member", label: "Team" },
];

const RANGE_LABEL: Record<Range, string> = {
  today: "Today",
  "7d": "7 days",
  "30d": "30 days",
  q2: "Q2",
};

function rangeCutoffMs(range: Range) {
  const day = 86_400_000;
  switch (range) {
    case "today":
      return day;
    case "7d":
      return 7 * day;
    case "30d":
      return 30 * day;
    case "q2":
      return 90 * day;
  }
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w`;
  return new Date(iso).toLocaleDateString();
}

function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function RecentUpdates({ items }: { items: RecentUpdate[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [range, setRange] = useState<Range>("today");

  // Listen for toolbar broadcasts
  useEffect(() => {
    function onRange(e: Event) {
      const r = (e as CustomEvent<Range>).detail;
      if (r) setRange(r);
    }
    function onExport() {
      const rows = [
        ["Kind", "Title", "Meta", "Updated"],
        ...filtered.map((i) => [
          i.kind,
          i.title,
          i.meta,
          new Date(i.updated_at).toISOString(),
        ]),
      ];
      const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recent-updates-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    window.addEventListener("home:range", onRange);
    window.addEventListener("home:export", onExport);
    return () => {
      window.removeEventListener("home:range", onRange);
      window.removeEventListener("home:export", onExport);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, range, items]);

  const filtered = useMemo(() => {
    const cutoff = Date.now() - rangeCutoffMs(range);
    let arr = items.filter((i) => new Date(i.updated_at).getTime() >= cutoff);
    if (filter !== "all") arr = arr.filter((i) => i.kind === filter);
    return arr.slice(0, 8);
  }, [items, filter, range]);

  return (
    <div className="bg-panel border border-border rounded-md flex flex-col h-full">
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-text-1">
            Recent updates
          </div>
          <div className="text-[11.5px] text-text-3 mt-0.5">
            Range: {RANGE_LABEL[range]} · across SOPs, docs, logins, team
          </div>
        </div>
      </div>
      <div className="px-3 flex gap-0.5 mb-1 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-medium rounded transition whitespace-nowrap",
              filter === f.value
                ? "bg-nexa-purple-tint text-nexa-purple"
                : "text-text-3 hover:text-text-1 hover:bg-panel-2",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-[12px] text-text-3 text-center">
            Nothing in this range.
          </p>
        ) : (
          filtered.map((item) => {
            const Icon = KIND_ICON[item.kind] ?? Megaphone;
            return (
              <Link
                key={`${item.kind}-${item.id}`}
                href={item.href}
                className="flex items-start gap-2.5 p-2 rounded-md hover:bg-panel-2 transition group"
              >
                <span className="shrink-0 mt-0.5 h-6 w-6 rounded bg-panel-2 group-hover:bg-nexa-purple-tint inline-flex items-center justify-center text-text-3 group-hover:text-nexa-purple transition">
                  <Icon className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-text-1 truncate">
                    {item.title}
                  </div>
                  <div className="text-[10.5px] text-text-3 truncate">
                    {item.meta}
                  </div>
                </div>
                <span className="text-[10px] text-text-4 shrink-0 mt-1">
                  {formatRelative(item.updated_at)}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
