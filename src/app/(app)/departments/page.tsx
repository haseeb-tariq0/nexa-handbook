import Link from "next/link";
import { ArrowRight, Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { listDepartments } from "@/lib/queries/departments";
import { departmentIcon } from "@/lib/department-icons";
import { isAdmin } from "@/lib/auth/is-admin";

export const revalidate = 60;

export default async function DepartmentsPage() {
  const [departments, admin] = await Promise.all([
    listDepartments(),
    isAdmin(),
  ]);
  const totalMembers = departments.reduce((s, d) => s + d.member_count, 0);

  return (
    <>
      <PageHeader
        title="Departments"
        description={
          departments.length > 0
            ? `${departments.length} departments at NEXA · ${totalMembers} people. Click any to explore.`
            : "Every team at NEXA — what they do, who leads them, and the tools they use."
        }
        actions={
          admin ? (
            <Link href="/admin/departments/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                Add a department
              </Button>
            </Link>
          ) : undefined
        }
      />

      {departments.length === 0 ? (
        <EmptyState
          title="No departments yet"
          description="The Operations Manager hasn't created any departments."
        />
      ) : (
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
              <div key={d.id} className="relative group">
                {admin && (
                  <Link
                    href={`/admin/departments/${d.id}`}
                    className="absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center h-6 w-6 rounded text-text-4 hover:text-nexa-purple hover:bg-nexa-purple-tint transition opacity-0 group-hover:opacity-100"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Pencil className="h-3 w-3" />
                  </Link>
                )}
                <Link
                  href={`/departments/${d.slug}`}
                  className="flex flex-col gap-2 bg-panel border border-border rounded-md p-4 transition hover:-translate-y-0.5 hover:shadow-sm hover:border-border-3 min-h-[140px]"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-panel-2 text-text-2 group-hover:bg-nexa-purple-tint group-hover:text-nexa-purple transition">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>

                  <div className="mt-1">
                    <div className="text-[13.5px] font-semibold text-text-1">
                      {d.name}
                    </div>
                    <div className="text-[11.5px] text-text-3 leading-snug">
                      {lead ? `Lead: ${lead.full_name}` : "No lead assigned"}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="text-[10.5px] text-text-4">
                      {d.member_count}{" "}
                      {d.member_count === 1 ? "person" : "people"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-text-4 opacity-0 group-hover:opacity-100 group-hover:text-nexa-purple group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
