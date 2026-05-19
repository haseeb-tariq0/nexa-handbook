import { reads } from "@/lib/supabase/reads";
import type { Doc, TeamMember } from "@/lib/db";

export type DocumentListItem = Pick<
  Doc,
  | "id"
  | "title"
  | "description"
  | "category"
  | "external_url"
  | "file_type"
  | "updated_at"
> & {
  owner: Pick<TeamMember, "id" | "full_name" | "avatar_url"> | null;
};

export async function listDocuments(): Promise<DocumentListItem[]> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("documents")
    .select(
      "id, title, description, category, external_url, file_type, updated_at, owner:owner_id(id, full_name, avatar_url)",
    )
    .eq("is_published", true)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`documents list failed: ${error.message}`);
  return (data ?? []) as DocumentListItem[];
}

// Re-export for backward compat with server-side imports.
export { DOC_CATEGORY_LABELS, FILE_TYPE_LABELS } from "@/lib/constants";
