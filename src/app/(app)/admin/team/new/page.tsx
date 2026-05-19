import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { listDepartments } from "@/lib/queries/departments";
import { listActiveTeam } from "@/lib/queries/team";
import { createTeamMember } from "@/app/(app)/admin/team/actions";

export default async function NewTeamMemberPage() {
  const [departments, team] = await Promise.all([
    listDepartments(),
    listActiveTeam(),
  ]);
  return (
    <>
      <PageHeader title="New team member" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/team" className="hover:text-text-1 transition">
          Team members
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <TeamMemberForm
        departmentOptions={departments.map((d) => ({ id: d.id, label: d.name }))}
        managerOptions={team.map((m) => ({ id: m.id, label: `${m.full_name} · ${m.role_title}` }))}
        onSubmit={async (fd) => {
          "use server";
          return createTeamMember(fd);
        }}
        submitLabel="Add member"
      />
    </>
  );
}
