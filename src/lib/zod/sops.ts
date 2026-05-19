import { z } from "zod";

export const sopSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  summary: z.string().max(280).nullable().optional(),
  body: z.string().max(20000).nullable().optional(),
  department_id: z.string().uuid().nullable().optional(),
  owner_id: z.string().uuid().nullable().optional(),
  external_link: z.string().url().or(z.literal("")).nullable().optional(),
  last_reviewed_at: z.string().nullable().optional(),
  is_published: z.boolean().default(true),
});

export type SopInput = z.infer<typeof sopSchema>;
