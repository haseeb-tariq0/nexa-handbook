import { reads } from "@/lib/supabase/reads";
import type { Sop, Department, TeamMember } from "@/lib/db";

export type SopListItem = Pick<
  Sop,
  | "id"
  | "title"
  | "slug"
  | "summary"
  | "department_id"
  | "owner_id"
  | "external_link"
  | "last_reviewed_at"
  | "updated_at"
> & {
  departments: Pick<Department, "id" | "name" | "slug"> | null;
  owner: Pick<TeamMember, "id" | "full_name" | "avatar_url"> | null;
};

export async function listPublishedSops(): Promise<SopListItem[]> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("sops")
    .select(
      "id, title, slug, summary, department_id, owner_id, external_link, last_reviewed_at, updated_at, departments(id, name, slug), owner:owner_id(id, full_name, avatar_url)",
    )
    .eq("is_published", true)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`sops list failed: ${error.message}`);
  return (data ?? []) as SopListItem[];
}

export type SopDetail = SopListItem & { body: string | null };

export async function getSopBySlug(slug: string): Promise<SopDetail | null> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("sops")
    .select(
      "id, title, slug, summary, body, department_id, owner_id, external_link, last_reviewed_at, updated_at, departments(id, name, slug), owner:owner_id(id, full_name, avatar_url)",
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data as SopDetail;
}

export async function listRelatedSops(
  departmentId: string,
  excludeId: string,
): Promise<Pick<Sop, "id" | "title" | "slug" | "summary">[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("sops")
    .select("id, title, slug, summary")
    .eq("department_id", departmentId)
    .eq("is_published", true)
    .neq("id", excludeId)
    .limit(5);
  return (data ?? []) as Pick<Sop, "id" | "title" | "slug" | "summary">[];
}
