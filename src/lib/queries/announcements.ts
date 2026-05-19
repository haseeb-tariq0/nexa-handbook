import { reads } from "@/lib/supabase/reads";
import type { Announcement, TeamMember } from "@/lib/db";

export type AnnouncementListItem = Pick<
  Announcement,
  | "id"
  | "title"
  | "body"
  | "category"
  | "is_pinned"
  | "published_at"
  | "posted_by_id"
> & { posted_by: Pick<TeamMember, "id" | "full_name"> | null };

export async function listRecentAnnouncements(
  limit = 10,
): Promise<AnnouncementListItem[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("announcements")
    .select(
      "id, title, body, category, is_pinned, published_at, posted_by_id, posted_by:posted_by_id(id, full_name)",
    )
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as AnnouncementListItem[];
}
