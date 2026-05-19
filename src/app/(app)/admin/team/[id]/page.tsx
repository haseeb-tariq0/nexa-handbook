import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { reads } from "@/lib/supabase/reads";
import { listDepartments } from "@/lib/queries/departments";
import { listActiveTeam } from "@/lib/queries/team";
import { updateTeamMember } from "@/app/(app)/admin/team/actions";

export const revalidate = 0;

async function getMember(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("team_members")
    .select(
      "id, email, full_name, role_title, department_id, slack_handle, phone, whatsapp, working_hours, location, reports_to, bio, avatar_url, is_active, sort_order",
    )
    .eq("id", id)
    .single();
  return data as {
    id: string;
    email: string;
    full_name: string;
    role_title: string;
    department_id: string | null;
    slack_handle: string | null;
    phone: string | null;
    whatsapp: string | null;
    working_hours: string | null;
    location: string | null;
    reports_to: string | null;
    bio: string | null;
    avatar_url: string | null;
    is_active: boolean;
    sort_order: number;
  } | null;
}

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [member, departments, team] = await Promise.all([
    getMember(id),
    listDepartments(),
    listActiveTeam(),
  ]);
  if (!member) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${member.full_name}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/team" className="hover:text-text-1 transition">
          Team members
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <TeamMemberForm
        initial={member}
        departmentOptions={departments.map((d) => ({ id: d.id, label: d.name }))}
        managerOptions={team.map((m) => ({
          id: m.id,
          label: `${m.full_name} · ${m.role_title}`,
        }))}
        onSubmit={async (fd) => {
          "use server";
          return updateTeamMember(member.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
