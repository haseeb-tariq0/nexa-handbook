"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, ChevronRight } from "lucide-react";
import { breadcrumbFor } from "@/lib/breadcrumb";
import { NotificationBell } from "@/components/layout/NotificationBell";
import type { AnnouncementListItem } from "@/lib/queries/announcements";

function openPalette() {
  window.dispatchEvent(new Event("palette:open"));
}

function openSidebar() {
  window.dispatchEvent(new Event("sidebar:open"));
}

export function TopBar({
  userInitials = "?",
  announcements = [],
  hasNewAnnouncements = false,
}: {
  userInitials?: string;
  announcements?: AnnouncementListItem[];
  hasNewAnnouncements?: boolean;
}) {
  const pathname = usePathname();
  const { section } = breadcrumbFor(pathname);

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-3 bg-panel/85 backdrop-blur border-b border-border px-4 sm:px-6"
      style={{ height: "var(--spacing-topbar)" }}
    >
      <button
        type="button"
        onClick={openSidebar}
        className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-border text-text-2 hover:text-text-1 hover:bg-panel-2 transition shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <nav
        aria-label="Breadcrumb"
        className="hidden md:flex items-center gap-1.5 text-[12.5px] text-text-3 shrink-0"
      >
        <span>Home</span>
        <ChevronRight className="h-3 w-3 text-text-4" />
        <span className="text-text-1 font-medium">{section}</span>
      </nav>

      <button
        type="button"
        onClick={openPalette}
        className="relative flex-1 max-w-[420px] mx-auto flex items-center text-left bg-panel-2 border border-border rounded-md py-2 pl-9 pr-3 sm:pr-14 text-[13px] text-text-3 hover:border-border-3 hover:text-text-1 transition"
        aria-label="Search (Ctrl+K)"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-4 pointer-events-none" />
        <span className="truncate">Search the handbook…</span>
        <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-[3px] text-[10px] font-medium text-text-3 bg-panel border border-border rounded font-mono">
          <span>Ctrl</span>
          <span className="text-text-4">+</span>
          <span>K</span>
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <NotificationBell
          announcements={announcements}
          hasNew={hasNewAnnouncements}
        />
        <Link
          href="/profile"
          aria-label="Profile"
          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-nexa-purple text-white text-xs font-semibold hover:opacity-90 transition"
        >
          {userInitials}
        </Link>
      </div>
    </header>
  );
}
