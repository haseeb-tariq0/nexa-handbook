"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnnouncementListItem } from "@/lib/queries/announcements";

const categoryStyle: Record<string, string> = {
  new: "text-status-green",
  reminder: "text-status-amber",
  access: "text-section-login",
  ops: "text-nexa-purple",
  tools: "text-section-tool",
  team: "text-section-team",
};

const categoryLabel: Record<string, string> = {
  new: "New",
  reminder: "Reminder",
  access: "Access",
  ops: "Ops",
  tools: "Tools",
  team: "Team",
};

export function NewsTicker({
  announcements,
}: {
  announcements: AnnouncementListItem[];
}) {
  if (announcements.length === 0) return null;

  // Duplicate the list for a seamless marquee loop.
  const looped = [...announcements, ...announcements];

  return (
    <div className="flex items-stretch bg-nexa-dark-purple rounded-md overflow-hidden mb-6">
      <div className="flex items-center gap-1.5 bg-nexa-purple text-white text-[10px] font-bold uppercase tracking-[0.16em] px-3.5 py-2 whitespace-nowrap shrink-0">
        <Megaphone className="h-3 w-3" />
        Updates
      </div>
      <div className="relative flex-1 overflow-hidden group">
        <div className="flex gap-12 whitespace-nowrap animate-ticker group-hover:[animation-play-state:paused]">
          {looped.map((a, i) => (
            <Link
              key={`${a.id}-${i}`}
              href="/internal-comms#announcements"
              className="inline-flex items-baseline gap-2 text-[12px] text-white/70 hover:text-white py-2 transition"
            >
              <span
                className={cn(
                  "font-semibold uppercase tracking-wider text-[10px]",
                  categoryStyle[a.category] ?? "text-white",
                )}
              >
                {categoryLabel[a.category] ?? a.category}
              </span>
              <span>{a.title}</span>
              <span className="text-white/40">— {a.body}</span>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
