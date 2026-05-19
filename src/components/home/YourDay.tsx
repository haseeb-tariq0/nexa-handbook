import Link from "next/link";
import {
  ListChecks,
  KeyRound,
  Compass,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import type { UserFocus, FocusItem } from "@/lib/queries/focus";

const ICON: Record<FocusItem["kind"], LucideIcon> = {
  sop: ListChecks,
  tool: KeyRound,
  onboarding: Compass,
  announcement: Megaphone,
};

export function YourDay({ focus }: { focus: UserFocus }) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[13px] font-semibold text-text-1">
              {focus.greeting}, {focus.firstName}
            </div>
            <div className="text-[11.5px] text-text-3 mt-0.5">{today}</div>
          </div>
          <span className="inline-flex items-center text-[10.5px] font-semibold text-nexa-purple bg-nexa-purple-tint px-2 py-0.5 rounded-full">
            Today
          </span>
        </div>

        {focus.items.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-[12px] text-text-3">
              Nothing on your plate right now.
            </p>
            <p className="text-[10.5px] text-text-4 mt-1">
              SOPs you own, tools you manage, and onboarding steps appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-1 -mx-2">
            {focus.items.map((it) => {
              const Icon = ICON[it.kind];
              return (
                <Link
                  key={`${it.kind}-${it.id}`}
                  href={it.href}
                  className="flex items-start gap-2.5 p-2 rounded-md hover:bg-panel-2 transition group"
                >
                  <span className="shrink-0 mt-0.5 h-6 w-6 rounded bg-panel-2 group-hover:bg-nexa-purple-tint inline-flex items-center justify-center text-text-3 group-hover:text-nexa-purple transition">
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-medium text-text-1 truncate group-hover:text-nexa-purple transition">
                      {it.title}
                    </div>
                    <div className="text-[10.5px] text-text-3 truncate">
                      {it.meta}
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
