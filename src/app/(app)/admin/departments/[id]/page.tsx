import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DepartmentForm } from "@/components/admin/DepartmentForm";
import { reads } from "@/lib/supabase/reads";
import { listActiveTeam } from "@/lib/queries/team";
import { updateDepartment } from "@/app/(app)/admin/departments/actions";

export const revalidate = 0;

async function getDepartmentById(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("departments")
    .select("id, name, slug, description, core_expertise, key_tools, lead_id, sort_order")
    .eq("id", id)
    .single();
  return data as {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    core_expertise: string[];
    key_tools: string[];
    lead_id: string | null;
    sort_order: number;
  } | null;
}

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [dept, team] = await Promise.all([
    getDepartmentById(id),
    listActiveTeam(),
  ]);
  if (!dept) notFound();

  return (
    <>
      <PageHeader
        title={`Edit · ${dept.name}`}
        description="Update this department."
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
        {dept.name}
      </div>

      <DepartmentForm
        initial={dept}
        leadOptions={team.map((m) => ({
          id: m.id,
          full_name: m.full_name,
        }))}
        onSubmit={async (formData) => {
          "use server";
          return updateDepartment(dept.id, formData);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
