import { z } from "zod";

export const onboardingStepSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(500).nullable().optional(),
  day_label: z.string().min(1).max(30),
  linked_section: z.string().max(30).nullable().optional(),
  external_url: z.string().url().or(z.literal("")).nullable().optional(),
  sort_order: z.coerce.number().int().min(0),
});

export type OnboardingStepInput = z.infer<typeof onboardingStepSchema>;
