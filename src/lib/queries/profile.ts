import { reads } from "@/lib/supabase/reads";
import type { TeamMember, Department } from "@/lib/db";

export type ProfileWithTeam = {
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  team: (Pick<
    TeamMember,
    | "id"
    | "full_name"
    | "role_title"
    | "slack_handle"
    | "phone"
    | "whatsapp"
    | "working_hours"
    | "location"
    | "bio"
    | "reports_to"
    | "department_id"
  > & {
    departments: Pick<Department, "id" | "name" | "slug"> | null;
    manager: Pick<TeamMember, "id" | "full_name" | "role_title"> | null;
  }) | null;
};

export async function getProfileWithTeam(email: string): Promise<ProfileWithTeam["team"]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("team_members")
    .select(
      "id, full_name, role_title, slack_handle, phone, whatsapp, working_hours, location, bio, reports_to, department_id, departments!team_members_department_id_fkey(id, name, slug), manager:team_members!team_members_reports_to_fkey(id, full_name, role_title)",
    )
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();
  return (data ?? null) as ProfileWithTeam["team"];
}

export type DirectReport = Pick<TeamMember, "id" | "full_name" | "role_title">;

export async function getDirectReports(managerId: string): Promise<DirectReport[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("team_members")
    .select("id, full_name, role_title")
    .eq("reports_to", managerId)
    .eq("is_active", true)
    .order("full_name", { ascending: true });
  return (data ?? []) as DirectReport[];
}
