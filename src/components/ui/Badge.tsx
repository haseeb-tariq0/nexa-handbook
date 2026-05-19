import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "purple" | "green" | "amber" | "rose" | "indigo" | "slate" | "coral";

const variants: Record<Variant, string> = {
  default: "bg-panel-2 text-text-2 border-border",
  purple: "bg-nexa-purple-tint text-nexa-purple border-nexa-purple/20",
  green: "bg-status-green-bg text-status-green border-status-green/20",
  amber: "bg-status-amber-bg text-status-amber border-status-amber/20",
  rose: "bg-status-rose-bg text-status-rose border-status-rose/20",
  indigo: "bg-[#EEF0FB] text-[#5066D0] border-[#5066D0]/20",
  slate: "bg-[#EEF1F3] text-[#5A7888] border-[#5A7888]/20",
  coral: "bg-[#FEF0EC] text-[#E05A3B] border-[#E05A3B]/20",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10.5px] font-medium tracking-tight whitespace-nowrap",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
