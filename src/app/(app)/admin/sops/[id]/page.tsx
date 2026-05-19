import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SopForm } from "@/components/admin/SopForm";
import { reads } from "@/lib/supabase/reads";
import { listDepartments } from "@/lib/queries/departments";
import { listActiveTeam } from "@/lib/queries/team";
import { updateSop } from "@/app/(app)/admin/sops/actions";

export const revalidate = 0;

async function getSopById(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("sops")
    .select(
      "id, title, slug, summary, body, department_id, owner_id, external_link, last_reviewed_at, is_published",
    )
    .eq("id", id)
    .single();
  return data as {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    body: string | null;
    department_id: string | null;
    owner_id: string | null;
    external_link: string | null;
    last_reviewed_at: string | null;
    is_published: boolean;
  } | null;
}

export default async function EditSopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [sop, departments, team] = await Promise.all([
    getSopById(id),
    listDepartments(),
    listActiveTeam(),
  ]);
  if (!sop) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${sop.title}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/sops" className="hover:text-text-1 transition">SOPs</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <SopForm
        initial={sop}
        departmentOptions={departments.map((d) => ({ id: d.id, label: d.name }))}
        ownerOptions={team.map((m) => ({ id: m.id, label: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return updateSop(sop.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
