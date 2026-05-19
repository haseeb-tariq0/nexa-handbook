import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "purple" | "green" | "indigo" | "coral" | "slate" | "rose";

const accentMap: Record<Accent, { bar: string; iconBg: string; iconText: string }> = {
  purple: {
    bar: "before:bg-nexa-purple",
    iconBg: "bg-nexa-purple-tint",
    iconText: "text-nexa-purple",
  },
  green: {
    bar: "before:bg-section-sop",
    iconBg: "bg-status-green-bg",
    iconText: "text-status-green",
  },
  indigo: {
    bar: "before:bg-section-doc",
    iconBg: "bg-[#EEF0FB]",
    iconText: "text-[#5066D0]",
  },
  coral: {
    bar: "before:bg-section-login",
    iconBg: "bg-[#FEF0EC]",
    iconText: "text-section-login",
  },
  slate: {
    bar: "before:bg-section-tool",
    iconBg: "bg-[#EEF1F3]",
    iconText: "text-section-tool",
  },
  rose: {
    bar: "before:bg-section-team",
    iconBg: "bg-status-rose-bg",
    iconText: "text-section-team",
  },
};

export function QuickTile({
  href,
  icon: Icon,
  title,
  description,
  accent = "purple",
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: Accent;
}) {
  const a = accentMap[accent];
  return (
    <Link
      href={href}
      className={cn(
        "group relative block bg-panel border border-border rounded-md p-5 transition hover:border-nexa-purple hover:shadow-sm overflow-hidden",
        "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:transition-all before:opacity-70 group-hover:before:opacity-100",
        a.bar,
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className={cn(
            "h-8 w-8 rounded-md inline-flex items-center justify-center",
            a.iconBg,
            a.iconText,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-text-4 group-hover:text-nexa-purple transition" />
      </div>
      <div className="text-[13.5px] font-semibold text-text-1 mb-1">
        {title}
      </div>
      <p className="text-[11.5px] text-text-3 leading-relaxed">{description}</p>
    </Link>
  );
}
