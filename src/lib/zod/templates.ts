import { z } from "zod";

const TEMPLATE_CATEGORIES = [
  "client_facing",
  "internal",
  "announcement",
  "hr",
  "meeting",
  "escalation",
] as const;

export const messageTemplateSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(400).nullable().optional(),
  body: z.string().min(1, "Body is required").max(10000),
  category: z.enum(TEMPLATE_CATEGORIES),
  owner_id: z.string().uuid().nullable().optional(),
});

export type MessageTemplateInput = z.infer<typeof messageTemplateSchema>;
