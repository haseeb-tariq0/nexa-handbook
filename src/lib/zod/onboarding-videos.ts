import { z } from "zod";

export const onboardingVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(500).nullable().optional(),
  video_url: z.string().url("Must be a valid URL"),
  thumbnail_url: z.string().url().or(z.literal("")).nullable().optional(),
  duration_label: z.string().max(20).nullable().optional(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.coerce.boolean().default(true),
});

export type OnboardingVideoInput = z.infer<typeof onboardingVideoSchema>;
