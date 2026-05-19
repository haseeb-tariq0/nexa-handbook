import { reads } from "@/lib/supabase/reads";
import type { CommsStandard, MessageTemplate, TeamMember, Announcement } from "@/lib/db";

export type CommsStandardItem = Pick<
  CommsStandard,
  "id" | "kind" | "title" | "body" | "meta" | "sort_order"
>;

export async function listCommsStandards(): Promise<CommsStandardItem[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("comms_standards")
    .select("id, kind, title, body, meta, sort_order")
    .order("sort_order", { ascending: true });
  return (data ?? []) as CommsStandardItem[];
}

export type MessageTemplateListItem = Pick<
  MessageTemplate,
  "id" | "title" | "description" | "body" | "category" | "usage_count"
> & {
  owner: Pick<TeamMember, "id" | "full_name"> | null;
};

export async function listMessageTemplates(): Promise<MessageTemplateListItem[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("message_templates")
    .select(
      "id, title, description, body, category, usage_count, owner:owner_id(id, full_name)",
    )
    .order("usage_count", { ascending: false });
  return (data ?? []) as MessageTemplateListItem[];
}

export type AnnouncementArchiveItem = Pick<
  Announcement,
  "id" | "title" | "body" | "category" | "is_pinned" | "published_at"
> & { posted_by: Pick<TeamMember, "id" | "full_name"> | null };

export async function listAnnouncementsArchive(): Promise<AnnouncementArchiveItem[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("announcements")
    .select(
      "id, title, body, category, is_pinned, published_at, posted_by:posted_by_id(id, full_name)",
    )
    .order("published_at", { ascending: false });
  return (data ?? []) as AnnouncementArchiveItem[];
}

// Re-export for backward compat with server-side imports.
export { TEMPLATE_CATEGORY_LABELS } from "@/lib/constants";
