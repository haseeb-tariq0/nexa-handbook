import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  description: z.string().max(800).nullable().optional(),
  core_expertise: z.array(z.string().min(1)).default([]),
  key_tools: z.array(z.string().min(1)).default([]),
  lead_id: z.string().uuid().nullable().optional(),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
