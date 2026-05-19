import Link from "next/link";
import {
  Clock,
  KeyRound,
  AlertTriangle,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ActionItem } from "@/lib/queries/home";

const KIND: Record<
  ActionItem["kind"],
  { icon: LucideIcon; label: string; variant: "amber" | "rose" | "purple" }
> = {
  sop_stale: { icon: Clock, label: "Stale", variant: "amber" },
  tool_expiring: { icon: KeyRound, label: "Expiring", variant: "amber" },
  tool_expired: { icon: AlertTriangle, label: "Expired", variant: "rose" },
  dept_no_lead: { icon: Building2, label: "No lead", variant: "purple" },
};

export function ActionNeeded({ items }: { items: ActionItem[] }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[13px] font-semibold text-text-1">
              Needs attention
            </div>
            <div className="text-[11.5px] text-text-3 mt-0.5">
              {items.length === 0
                ? "Nothing right now — well done"
                : `${items.length} item${items.length === 1 ? "" : "s"} to look at`}
            </div>
          </div>
          {items.length > 0 && (
            <span className="inline-flex items-center text-[10.5px] font-semibold text-status-amber bg-status-amber-bg px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-[12px] text-text-3 text-center py-4">
            No stale SOPs, expiring credentials, or unassigned departments.
          </p>
        ) : (
          <div className="space-y-1.5">
            {items.map((item) => {
              const meta = KIND[item.kind];
              const Icon = meta.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-start gap-3 p-2 -mx-2 rounded-md hover:bg-panel-2 transition group"
                >
                  <span className="shrink-0 mt-0.5">
                    <Badge variant={meta.variant}>
                      <Icon className="h-2.5 w-2.5" />
                      {meta.label}
                    </Badge>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium text-text-1 truncate group-hover:text-nexa-purple transition">
                      {item.title}
                    </div>
                    <div className="text-[10.5px] text-text-3 truncate">
                      {item.meta}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
