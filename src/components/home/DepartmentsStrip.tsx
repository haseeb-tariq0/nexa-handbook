import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { departmentIcon } from "@/lib/department-icons";
import type { DepartmentListItem } from "@/lib/queries/departments";

export function DepartmentsStrip({
  departments,
}: {
  departments: DepartmentListItem[];
}) {
  if (departments.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-text-4 font-semibold">
          Departments
        </div>
        <Link
          href="/departments"
          className="inline-flex items-center gap-1 text-[11.5px] text-text-3 hover:text-nexa-purple transition"
        >
          View all {departments.length}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
        }}
      >
        {departments.map((d) => {
          const lead = Array.isArray(d.lead) ? d.lead[0] : d.lead;
          const Icon = departmentIcon(d.slug);
          return (
            <Link
              key={d.id}
              href={`/departments/${d.slug}`}
              className="group flex flex-col gap-2 bg-panel border border-border rounded-md p-4 transition hover:-translate-y-0.5 hover:shadow-sm hover:border-border-3 min-h-[120px]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-panel-2 text-text-2 group-hover:bg-nexa-purple-tint group-hover:text-nexa-purple transition">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div className="mt-1">
                <div className="text-[12.5px] font-semibold text-text-1">
                  {d.name}
                </div>
                <div className="text-[10.5px] text-text-3 leading-snug">
                  {lead ? lead.full_name : "No lead"} · {d.member_count}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
