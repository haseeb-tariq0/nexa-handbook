import { z } from "zod";

export const internalToolSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
  url: z.string().url("Must be a valid URL"),
  description: z.string().max(400).nullable().optional(),
  icon_emoji: z.string().max(8).nullable().optional(),
  accent_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex colour like #9334FF")
    .nullable()
    .optional(),
  is_live: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type InternalToolInput = z.infer<typeof internalToolSchema>;
