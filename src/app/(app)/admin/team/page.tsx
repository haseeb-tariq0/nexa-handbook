import Link from "next/link";
import { Plus, Pencil, ChevronRight, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { reads } from "@/lib/supabase/reads";
import { deleteTeamMember } from "@/app/(app)/admin/team/actions";

export const revalidate = 0;

async function listAllTeamMembers() {
  const supabase = await reads();
  const { data } = await supabase
    .from("team_members")
    .select(
      "id, full_name, email, role_title, avatar_url, is_active, sort_order, departments!team_members_department_id_fkey(name)",
    )
    .order("is_active", { ascending: false })
    .order("sort_order", { ascending: true });
  return (data ?? []) as Array<{
    id: string;
    full_name: string;
    email: string;
    role_title: string;
    avatar_url: string | null;
    is_active: boolean;
    sort_order: number;
    departments: { name: string } | null;
  }>;
}

export default async function AdminTeamPage() {
  const members = await listAllTeamMembers();

  return (
    <>
      <PageHeader
        title="Team members"
        description="Directory entries — both active and archived."
        actions={
          <Link href="/admin/team/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New member
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Team members
      </div>

      {members.length === 0 ? (
        <EmptyState title="No team members yet" description="Add the first one." />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_160px_140px_80px_120px] gap-4 px-5 py-3 bg-panel-2 border-b border-border text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
            <div>Name</div>
            <div>Department</div>
            <div>Role</div>
            <div className="text-right">Sort</div>
            <div className="text-right">Actions</div>
          </div>
          {members.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-[1fr_160px_140px_80px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={m.full_name} src={m.avatar_url} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-text-1 truncate">
                      {m.full_name}
                    </span>
                    {!m.is_active && (
                      <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-text-3 bg-panel-2 border border-border px-1.5 py-0.5 rounded">
                        <EyeOff className="h-2.5 w-2.5" />
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="text-[10.5px] text-text-4 truncate">{m.email}</div>
                </div>
              </div>
              <div>
                {m.departments?.name ? (
                  <Badge variant="purple">{m.departments.name}</Badge>
                ) : (
                  <span className="text-text-4 text-[11px]">—</span>
                )}
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {m.role_title}
              </div>
              <div className="text-[11.5px] text-text-3 text-right">
                {m.sort_order}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/team/${m.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={m.full_name}
                  onDelete={async () => {
                    "use server";
                    return deleteTeamMember(m.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
