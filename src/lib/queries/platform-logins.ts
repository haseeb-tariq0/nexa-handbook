import { reads } from "@/lib/supabase/reads";
import type { PlatformLogin, TeamMember } from "@/lib/db";

export type PlatformLoginListItem = Pick<
  PlatformLogin,
  | "id"
  | "tool_name"
  | "tool_url"
  | "description"
  | "category"
  | "login_identifier"
  | "credential_value"
  | "price"
  | "valid_until"
  | "access_notes"
> & {
  managed_by: Pick<TeamMember, "id" | "full_name" | "avatar_url"> | null;
};

export async function listPlatformLogins(): Promise<PlatformLoginListItem[]> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("platform_logins")
    .select(
      "id, tool_name, tool_url, description, category, login_identifier, credential_value, price, valid_until, access_notes, managed_by:managed_by_id(id, full_name, avatar_url)",
    )
    .order("tool_name", { ascending: true });
  if (error) throw new Error(`platform logins failed: ${error.message}`);
  return (data ?? []) as PlatformLoginListItem[];
}

// Re-export for backward compat with server-side imports.
export { PLATFORM_CATEGORY_LABELS as CATEGORY_LABELS } from "@/lib/constants";
