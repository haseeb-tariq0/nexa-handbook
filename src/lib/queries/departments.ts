import { reads } from "@/lib/supabase/reads";
import type { Department, TeamMember, Sop } from "@/lib/db";

type LeadMini = Pick<
  TeamMember,
  "id" | "full_name" | "role_title" | "avatar_url"
>;

export type DepartmentListItem = Pick<
  Department,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "core_expertise"
  | "key_tools"
  | "sort_order"
> & {
  lead: LeadMini | null;
  member_count: number;
};

export async function listDepartments(): Promise<DepartmentListItem[]> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("departments")
    .select(
      "id, name, slug, description, core_expertise, key_tools, sort_order, lead:lead_id(id, full_name, role_title, avatar_url), members:team_members!team_members_department_id_fkey(id, is_active)",
    )
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`departments list failed: ${error.message}`);

  type Raw = Omit<DepartmentListItem, "member_count"> & {
    members?: { id: string; is_active: boolean }[];
  };
  return ((data ?? []) as Raw[]).map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    core_expertise: d.core_expertise,
    key_tools: d.key_tools,
    sort_order: d.sort_order,
    lead: d.lead,
    member_count: (d.members ?? []).filter((m) => m.is_active).length,
  }));
}

export type DepartmentDetail = Pick<
  Department,
  "id" | "name" | "slug" | "description" | "core_expertise" | "key_tools"
> & { lead: LeadMini | null };

export async function getDepartmentBySlug(
  slug: string,
): Promise<DepartmentDetail | null> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("departments")
    .select(
      "id, name, slug, description, core_expertise, key_tools, lead:lead_id(id, full_name, role_title, avatar_url)",
    )
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as DepartmentDetail;
}

export type DepartmentMember = Pick<
  TeamMember,
  "id" | "full_name" | "role_title" | "email" | "slack_handle" | "avatar_url" | "sort_order"
>;

export async function listDepartmentMembers(
  departmentId: string,
): Promise<DepartmentMember[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("team_members")
    .select(
      "id, full_name, role_title, email, slack_handle, avatar_url, sort_order",
    )
    .eq("department_id", departmentId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as DepartmentMember[];
}

export type DepartmentSop = Pick<
  Sop,
  "id" | "title" | "slug" | "summary" | "last_reviewed_at" | "updated_at"
>;

export async function listDepartmentSops(
  departmentId: string,
): Promise<DepartmentSop[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("sops")
    .select("id, title, slug, summary, last_reviewed_at, updated_at")
    .eq("department_id", departmentId)
    .eq("is_published", true)
    .order("updated_at", { ascending: false });
  return (data ?? []) as DepartmentSop[];
}
