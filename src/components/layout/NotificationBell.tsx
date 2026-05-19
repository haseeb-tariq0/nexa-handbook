"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { AnnouncementListItem } from "@/lib/queries/announcements";

const categoryVariant: Record<
  string,
  "purple" | "green" | "amber" | "rose" | "indigo" | "slate" | "coral"
> = {
  new: "green",
  reminder: "amber",
  access: "coral",
  ops: "purple",
  tools: "slate",
  team: "rose",
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60_000);
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

export function NotificationBell({
  announcements,
  hasNew,
}: {
  announcements: AnnouncementListItem[];
  hasNew?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div ref={wrapperRef} className="hidden sm:block relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Announcements"
        aria-expanded={open}
        title="Announcements"
        className={cn(
          "relative inline-flex items-center justify-center h-9 w-9 rounded-md border transition",
          open
            ? "border-nexa-purple bg-nexa-purple-tint text-nexa-purple"
            : "border-border text-text-2 hover:text-text-1 hover:bg-panel-2",
        )}
      >
        <Bell className="h-4 w-4" />
        {hasNew && !open && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-nexa-purple ring-2 ring-panel" />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Announcements"
          className="absolute right-0 top-full mt-2 w-[360px] max-h-[480px] bg-panel border border-border-3 rounded-lg shadow-2xl overflow-hidden flex flex-col z-40"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="text-[13px] font-semibold text-text-1">
              Announcements
            </div>
            <span className="text-[10.5px] text-text-4">
              {announcements.length} recent
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className="py-10 text-center text-[12.5px] text-text-3">
              No announcements yet.
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {announcements.map((a) => (
                <Link
                  key={a.id}
                  href="/internal-comms#announcements"
                  onClick={() => setOpen(false)}
                  className="flex flex-col gap-1 px-4 py-3 border-b border-border last:border-b-0 hover:bg-panel-2 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant={categoryVariant[a.category] ?? "default"}>
                        {a.category}
                      </Badge>
                      {a.is_pinned && (
                        <Badge variant="amber">Pinned</Badge>
                      )}
                    </div>
                    <span className="text-[10.5px] text-text-4 shrink-0">
                      {relativeTime(a.published_at)}
                    </span>
                  </div>
                  <div className="text-[12.5px] font-medium text-text-1 truncate">
                    {a.title}
                  </div>
                  <div className="text-[11.5px] text-text-3 line-clamp-2">
                    {a.body}
                  </div>
                  {a.posted_by && (
                    <div className="text-[10.5px] text-text-4 mt-0.5">
                      {a.posted_by.full_name}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/internal-comms#announcements"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 px-4 py-2.5 border-t border-border text-[11.5px] font-medium text-nexa-purple hover:bg-nexa-purple-tint transition"
          >
            View all announcements
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
