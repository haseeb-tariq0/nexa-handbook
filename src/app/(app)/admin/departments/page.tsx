import Link from "next/link";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listDepartments } from "@/lib/queries/departments";
import { deleteDepartment } from "@/app/(app)/admin/departments/actions";

export const revalidate = 0;

export default async function AdminDepartmentsPage() {
  const departments = await listDepartments();

  return (
    <>
      <PageHeader
        title="Departments"
        description="Manage NEXA's department structure."
        actions={
          <Link href="/admin/departments/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New department
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>{" "}
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />{" "}
        Departments
      </div>

      {departments.length === 0 ? (
        <EmptyState
          title="No departments yet"
          description="Create the first one."
          action={
            <Link href="/admin/departments/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                Add a department
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_180px_120px_80px_120px] gap-4 px-5 py-3 bg-panel-2 border-b border-border text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
            <div>Name</div>
            <div>Lead</div>
            <div>Members</div>
            <div className="text-right">Sort</div>
            <div className="text-right">Actions</div>
          </div>
          {departments.map((d) => {
            const lead = Array.isArray(d.lead) ? d.lead[0] : d.lead;
            return (
              <div
                key={d.id}
                className="grid grid-cols-[1fr_180px_120px_80px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 group transition"
              >
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-text-1 truncate">
                    {d.name}
                  </div>
                  <div className="text-[10.5px] text-text-4 font-mono truncate">
                    /{d.slug}
                  </div>
                </div>
                <div className="text-[11.5px] text-text-2 truncate">
                  {lead?.full_name ?? <span className="text-text-4">—</span>}
                </div>
                <div className="text-[11.5px] text-text-2">{d.member_count}</div>
                <div className="text-[11.5px] text-text-3 text-right">
                  {d.sort_order}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/admin/departments/${d.id}`}>
                    <Button variant="ghost" size="sm" aria-label="Edit">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </Link>
                  <DeleteButton
                    itemLabel={d.name}
                    onDelete={async () => {
                      "use server";
                      return deleteDepartment(d.id);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
