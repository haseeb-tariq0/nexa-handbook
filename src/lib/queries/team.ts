import { reads } from "@/lib/supabase/reads";
import type { Department, TeamMember } from "@/lib/db";

type DepartmentMini = Pick<Department, "id" | "name" | "slug">;

export type TeamMemberListItem = Pick<
  TeamMember,
  | "id"
  | "full_name"
  | "email"
  | "role_title"
  | "slack_handle"
  | "phone"
  | "whatsapp"
  | "working_hours"
  | "location"
  | "avatar_url"
  | "bio"
  | "sort_order"
  | "department_id"
  | "reports_to"
> & {
  departments: DepartmentMini | null;
  intended_admin?: boolean;
};

export async function listActiveTeam(): Promise<TeamMemberListItem[]> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("team_members")
    .select(
      "id, full_name, email, role_title, slack_handle, phone, whatsapp, working_hours, location, avatar_url, bio, sort_order, department_id, reports_to, intended_admin, departments!team_members_department_id_fkey(id, name, slug)",
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`team list failed: ${error.message}`);
  return (data ?? []) as TeamMemberListItem[];
}

export type TeamMemberDetail = TeamMemberListItem;

export async function getTeamMemberById(
  id: string,
): Promise<TeamMemberDetail | null> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("team_members")
    .select(
      "id, full_name, email, role_title, slack_handle, phone, whatsapp, working_hours, location, avatar_url, bio, sort_order, department_id, reports_to, departments!team_members_department_id_fkey(id, name, slug)",
    )
    .eq("id", id)
    .single();
  if (error) return null;
  return data as TeamMemberDetail;
}

export type DirectReport = Pick<TeamMember, "id" | "full_name" | "role_title">;

export async function getDirectReports(
  managerId: string,
): Promise<DirectReport[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("team_members")
    .select("id, full_name, role_title")
    .eq("reports_to", managerId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as DirectReport[];
}
