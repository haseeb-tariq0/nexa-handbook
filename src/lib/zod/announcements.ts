import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  body: z.string().min(1, "Body is required").max(500),
  category: z.enum(["new", "reminder", "access", "ops", "tools", "team"]),
  posted_by_id: z.string().uuid().nullable().optional(),
  is_pinned: z.boolean().default(false),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
