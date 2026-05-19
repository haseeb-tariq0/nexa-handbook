import { reads } from "@/lib/supabase/reads";
import type { Profile, TeamMember } from "@/lib/db";

export type UserListItem = Pick<
  Profile,
  "id" | "email" | "full_name" | "avatar_url" | "is_admin" | "created_at" | "updated_at"
> & {
  team_member: Pick<TeamMember, "id" | "role_title" | "department_id"> | null;
};

export async function listProfiles(): Promise<UserListItem[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, avatar_url, is_admin, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  type ProfileRow = Pick<
    Profile,
    "id" | "email" | "full_name" | "avatar_url" | "is_admin" | "created_at" | "updated_at"
  >;
  const profiles = (data ?? []) as ProfileRow[];

  // Match each profile to its team_member by email
  const emails = profiles.map((p) => p.email);
  if (emails.length === 0) return [];

  const { data: tms } = await supabase
    .from("team_members")
    .select("id, email, role_title, department_id")
    .in("email", emails);

  const byEmail = new Map<
    string,
    Pick<TeamMember, "id" | "role_title" | "department_id">
  >();
  for (const m of (tms ?? []) as Array<{
    id: string;
    email: string;
    role_title: string;
    department_id: string | null;
  }>) {
    byEmail.set(m.email, {
      id: m.id,
      role_title: m.role_title,
      department_id: m.department_id,
    });
  }

  return profiles.map((p) => ({
    ...p,
    team_member: byEmail.get(p.email) ?? null,
  }));
}

// Read ADMIN_EMAILS env var, normalized.
export function getAdminEmailList(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}
