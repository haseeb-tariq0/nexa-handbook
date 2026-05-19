import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SopForm } from "@/components/admin/SopForm";
import { listDepartments } from "@/lib/queries/departments";
import { listActiveTeam } from "@/lib/queries/team";
import { createSop } from "@/app/(app)/admin/sops/actions";

export default async function NewSopPage() {
  const [departments, team] = await Promise.all([
    listDepartments(),
    listActiveTeam(),
  ]);
  return (
    <>
      <PageHeader title="New SOP" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/sops" className="hover:text-text-1 transition">SOPs</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <SopForm
        departmentOptions={departments.map((d) => ({ id: d.id, label: d.name }))}
        ownerOptions={team.map((m) => ({ id: m.id, label: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return createSop(fd);
        }}
        submitLabel="Create SOP"
      />
    </>
  );
}
