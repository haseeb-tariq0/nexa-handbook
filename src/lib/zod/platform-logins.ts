import { z } from "zod";

const PLATFORM_CATEGORIES = [
  "design",
  "production",
  "web",
  "sales_am",
  "seo",
  "content",
  "performance",
  "social",
  "everyone",
  "ai_labs",
] as const;

export const platformLoginSchema = z.object({
  tool_name: z.string().min(1, "Tool name is required").max(80),
  tool_url: z.string().url().or(z.literal("")).nullable().optional(),
  description: z.string().max(400).nullable().optional(),
  category: z.enum(PLATFORM_CATEGORIES),
  login_identifier: z.string().max(120).nullable().optional(),
  credential_value: z.string().max(400).nullable().optional(),
  price: z.string().max(60).nullable().optional(),
  valid_until: z.string().nullable().optional(),
  access_notes: z.string().max(400).nullable().optional(),
  managed_by_id: z.string().uuid().nullable().optional(),
});

export type PlatformLoginInput = z.infer<typeof platformLoginSchema>;
