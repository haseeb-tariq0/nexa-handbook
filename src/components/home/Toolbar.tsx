"use client";

import { useState, useEffect } from "react";
import { Activity, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Range = "today" | "7d" | "30d" | "q2";

const RANGES: { value: Range; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "q2", label: "Q2" },
];

function broadcast(range: Range) {
  window.dispatchEvent(new CustomEvent("home:range", { detail: range }));
}

function exportRecentCsv() {
  window.dispatchEvent(new Event("home:export"));
}

export function Toolbar() {
  const [range, setRange] = useState<Range>("today");
  const [now, setNow] = useState<Date | null>(null);

  // Render the time client-side so SSR + hydration match.
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  function pick(r: Range) {
    setRange(r);
    broadcast(r);
  }

  const fullDate = now
    ? now.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const time = now
    ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div>
        <h1 className="text-[22px] font-semibold text-text-1 tracking-tight">
          Overview
        </h1>
        <div className="flex items-center gap-2 text-[11.5px] text-text-3 mt-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-status-green opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-green" />
            </span>
            Live
          </span>
          {now && (
            <>
              <span className="text-text-4">·</span>
              <span>
                {fullDate} · {time}
              </span>
            </>
          )}
          <span className="text-text-4">·</span>
          <span className="inline-flex items-center gap-1 text-text-3">
            <Activity className="h-2.5 w-2.5" />
            Manually maintained
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="inline-flex items-center gap-0.5 bg-panel border border-border rounded-md p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => pick(r.value)}
              className={cn(
                "px-3 py-1.5 text-[11.5px] font-medium rounded transition whitespace-nowrap",
                range === r.value
                  ? "bg-text-1 text-white"
                  : "text-text-3 hover:text-text-1",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportRecentCsv}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] font-medium bg-panel border border-border rounded-md text-text-2 hover:text-text-1 hover:border-border-3 transition"
        >
          <Download className="h-3 w-3" />
          Export
        </button>
      </div>
    </div>
  );
}
