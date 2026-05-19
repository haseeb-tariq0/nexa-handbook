import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import type { PlatformHealth as PlatformHealthData } from "@/lib/queries/home";

export function PlatformHealth({ data }: { data: PlatformHealthData }) {
  const overallHealthy = data.actionNeeded === 0;

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[13px] font-semibold text-text-1">
              Platform health
            </div>
            <div className="text-[11.5px] text-text-3 mt-0.5">
              {data.total} tools tracked · {data.scanLabel}
            </div>
          </div>
          <span
            className={
              overallHealthy
                ? "inline-flex items-center gap-1 text-[10.5px] font-semibold text-status-green bg-status-green-bg px-2 py-0.5 rounded-full"
                : "inline-flex items-center gap-1 text-[10.5px] font-semibold text-status-rose bg-status-rose-bg px-2 py-0.5 rounded-full"
            }
          >
            <span
              className={
                overallHealthy
                  ? "h-1.5 w-1.5 rounded-full bg-status-green"
                  : "h-1.5 w-1.5 rounded-full bg-status-rose"
              }
            />
            {overallHealthy ? "Healthy" : "Attention needed"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatCell
            value={data.healthy}
            label="Healthy"
            color="text-status-green"
          />
          <StatCell
            value={data.expiring}
            label="Expiring < 30d"
            color="text-status-amber"
          />
          <StatCell
            value={data.actionNeeded}
            label="Action needed"
            color="text-status-rose"
          />
        </div>

        {data.attention.length === 0 ? (
          <p className="text-[11.5px] text-text-3 text-center py-2">
            Nothing expiring soon.
          </p>
        ) : (
          <div className="space-y-1 -mx-2">
            {data.attention.map((item) => (
              <Link
                key={item.id}
                href="/platform-logins"
                className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-panel-2 transition group"
              >
                <span
                  className={
                    item.severity === "rose"
                      ? "h-1.5 w-1.5 rounded-full bg-status-rose shrink-0"
                      : "h-1.5 w-1.5 rounded-full bg-status-amber shrink-0"
                  }
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] text-text-1 font-medium truncate">
                    {item.name}
                  </div>
                  <div className="text-[10.5px] text-text-3 truncate">
                    {item.reason}
                  </div>
                </div>
                <span className="text-[10.5px] text-text-4 shrink-0">
                  {item.dueLabel}
                </span>
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/platform-logins"
          className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11.5px] text-text-3 hover:text-nexa-purple transition"
        >
          View all logins
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardBody>
    </Card>
  );
}

function StatCell({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-panel-2 rounded-md py-3 px-2 text-center">
      <div
        className={`text-[22px] font-semibold leading-none tracking-tight ${color}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-text-3 mt-1.5 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
