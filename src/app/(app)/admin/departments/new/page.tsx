import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DepartmentForm } from "@/components/admin/DepartmentForm";
import { listActiveTeam } from "@/lib/queries/team";
import { createDepartment } from "@/app/(app)/admin/departments/actions";

export const revalidate = 0;

export default async function NewDepartmentPage() {
  const team = await listActiveTeam();

  return (
    <>
      <PageHeader
        title="New department"
        description="Create a new team under NEXA."
      />

      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>{" "}
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />{" "}
        <Link
          href="/admin/departments"
          className="hover:text-text-1 transition"
        >
          Departments
        </Link>{" "}
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />{" "}
        New
      </div>

      <DepartmentForm
        leadOptions={team.map((m) => ({
          id: m.id,
          full_name: m.full_name,
        }))}
        onSubmit={async (formData) => {
          "use server";
          return createDepartment(formData);
        }}
        submitLabel="Create department"
      />
    </>
  );
}
