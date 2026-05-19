import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/home/Sparkline";

type Accent = "purple" | "green" | "indigo" | "coral" | "slate" | "rose";

const accentBg: Record<Accent, string> = {
  purple: "bg-nexa-purple-tint text-nexa-purple",
  green: "bg-status-green-bg text-status-green",
  indigo: "bg-[#EEF0FB] text-[#5066D0]",
  coral: "bg-[#FEF0EC] text-[#E05A3B]",
  slate: "bg-[#EEF1F3] text-[#5A7888]",
  rose: "bg-status-rose-bg text-status-rose",
};

const accentLine: Record<Accent, string> = {
  purple: "#9334FF",
  green: "#1B9A60",
  indigo: "#5066D0",
  coral: "#E05A3B",
  slate: "#5A7888",
  rose: "#C8385A",
};

export function StatTile({
  label,
  value,
  hint,
  icon,
  sparkline,
  accent = "purple",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  sparkline?: number[];
  accent?: Accent;
}) {
  return (
    <div className="bg-panel border border-border rounded-md p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11.5px] font-medium text-text-3 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <span
            className={cn(
              "h-7 w-7 rounded-md inline-flex items-center justify-center",
              accentBg[accent],
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="text-[26px] font-semibold text-text-1 leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 min-h-[24px]">
        {hint && <span className="text-[11px] text-text-3">{hint}</span>}
        {sparkline && sparkline.length >= 2 && (
          <Sparkline values={sparkline} color={accentLine[accent]} />
        )}
      </div>
    </div>
  );
}
