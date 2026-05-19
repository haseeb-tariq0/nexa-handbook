import { z } from "zod";

const DOC_CATEGORIES = [
  "brand",
  "templates",
  "policies",
  "onboarding",
  "hr",
  "finance",
  "operations",
  "creative",
  "ai_tech",
] as const;

const FILE_TYPES = ["pdf", "docx", "pptx", "gdoc", "gsheet", "link", "video"] as const;

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  description: z.string().max(400).nullable().optional(),
  category: z.enum(DOC_CATEGORIES),
  external_url: z.string().url("Must be a valid URL"),
  file_type: z.enum(FILE_TYPES).nullable().optional(),
  owner_id: z.string().uuid().nullable().optional(),
  is_published: z.boolean().default(true),
});

export type DocumentInput = z.infer<typeof documentSchema>;
