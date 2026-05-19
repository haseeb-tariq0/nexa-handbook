import { z } from "zod";

export const teamMemberSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Must be a valid email")
    .max(120),
  full_name: z.string().min(1, "Name is required").max(120),
  role_title: z.string().min(1, "Role is required").max(80),
  department_id: z.string().uuid().nullable().optional(),
  slack_handle: z.string().max(40).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  whatsapp: z.string().max(40).nullable().optional(),
  working_hours: z.string().max(120).nullable().optional(),
  location: z.string().max(60).nullable().optional(),
  reports_to: z.string().uuid().nullable().optional(),
  bio: z.string().max(1200).nullable().optional(),
  avatar_url: z.string().url().or(z.literal("")).nullable().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
