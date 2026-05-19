"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Home,
  ListChecks,
  Users,
  KeyRound,
  Folder,
  Zap,
  Megaphone,
  Compass,
  User,
  Building2,
  FileText,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { PaletteItem } from "@/lib/queries/palette";
import { cn } from "@/lib/utils";

const KIND_ICON = {
  page: Home,
  sop: ListChecks,
  person: Users,
  department: Building2,
  tool: Zap,
  platform: KeyRound,
  document: FileText,
} as const;

const KIND_LABEL: Record<PaletteItem["kind"], string> = {
  page: "Pages",
  sop: "SOPs",
  person: "People",
  department: "Departments",
  tool: "Tools",
  platform: "Platform logins",
  document: "Documents",
};

// Page-specific icons override the generic kind icon
const PAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/sops": ListChecks,
  "/team": Users,
  "/departments": Building2,
  "/onboarding": Compass,
  "/documents": Folder,
  "/platform-logins": KeyRound,
  "/internal-comms": Megaphone,
  "/nexa-tools": Zap,
  "/profile": User,
};

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Listen for ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Listen for "palette:open" custom event (TopBar search input dispatches this)
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("palette:open", onOpen);
    return () => window.removeEventListener("palette:open", onOpen);
  }, []);

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router],
  );

  // Group items by kind for clean rendering. Order: pages first, then dynamic.
  const grouped: Record<string, PaletteItem[]> = {};
  for (const item of items) {
    grouped[item.kind] ??= [];
    grouped[item.kind].push(item);
  }
  const order: PaletteItem["kind"][] = [
    "page",
    "sop",
    "person",
    "department",
    "platform",
    "document",
    "tool",
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed left-1/2 top-[18vh] -translate-x-1/2 z-50 w-[min(640px,calc(100vw-32px))] transition-all",
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <Command
          label="Search the handbook"
          className="bg-panel border border-border-3 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
        >
          <div className="relative border-b border-border">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-3 pointer-events-none" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search pages, SOPs, people, tools…"
              className="w-full pl-11 pr-16 py-3.5 text-[14px] bg-transparent outline-none placeholder:text-text-4"
              autoFocus
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-text-3 bg-panel-2 border border-border rounded font-mono">
              Esc
            </kbd>
          </div>

          <Command.List className="flex-1 overflow-y-auto py-2 px-1.5">
            <Command.Empty className="py-10 text-center text-[12.5px] text-text-3">
              No results.
            </Command.Empty>

            {order.map((kind) => {
              const list = grouped[kind];
              if (!list || list.length === 0) return null;
              return (
                <Command.Group
                  key={kind}
                  heading={
                    <span className="px-2.5 pt-2 pb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-text-4">
                      {KIND_LABEL[kind]}
                    </span>
                  }
                >
                  {list.map((item) => {
                    const Icon =
                      kind === "page"
                        ? (PAGE_ICONS[item.href] ?? KIND_ICON.page)
                        : KIND_ICON[kind];
                    return (
                      <Command.Item
                        key={item.id}
                        value={`${item.title} ${item.hint ?? ""} ${item.keywords ?? ""}`}
                        onSelect={() => handleSelect(item.href)}
                        className="group flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-pointer text-[12.5px] aria-selected:bg-nexa-purple-tint aria-selected:text-nexa-purple data-[selected=true]:bg-nexa-purple-tint data-[selected=true]:text-nexa-purple"
                      >
                        <span className="h-7 w-7 rounded bg-panel-2 group-aria-selected:bg-white inline-flex items-center justify-center text-text-3 group-aria-selected:text-nexa-purple shrink-0 transition">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-text-1 group-aria-selected:text-nexa-purple font-medium truncate transition">
                            {item.title}
                          </div>
                          {item.hint && (
                            <div className="text-[10.5px] text-text-3 truncate">
                              {item.hint}
                            </div>
                          )}
                        </div>
                        <CornerDownLeft className="h-3 w-3 text-text-4 opacity-0 group-aria-selected:opacity-100 transition" />
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              );
            })}
          </Command.List>

          <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-panel-2 text-[10.5px] text-text-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center h-4 w-4 bg-panel border border-border rounded text-[9.5px]">
                  <ArrowUp className="h-2.5 w-2.5" />
                </kbd>
                <kbd className="inline-flex items-center justify-center h-4 w-4 bg-panel border border-border rounded text-[9.5px]">
                  <ArrowDown className="h-2.5 w-2.5" />
                </kbd>
                Navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center h-4 w-4 bg-panel border border-border rounded text-[9.5px]">
                  <CornerDownLeft className="h-2.5 w-2.5" />
                </kbd>
                Open
              </span>
            </div>
            <span>{items.length} items indexed</span>
          </div>
        </Command>
      </div>
    </>
  );
}
