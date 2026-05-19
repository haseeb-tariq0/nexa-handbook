import { z } from "zod";

const COMMS_KINDS = [
  "channel",
  "response_standard",
  "meeting_do",
  "meeting_dont",
  "meeting_decision",
  "escalation_path",
] as const;

export const commsStandardSchema = z.object({
  kind: z.enum(COMMS_KINDS),
  title: z.string().min(1, "Title is required").max(120),
  body: z.string().max(800).nullable().optional(),
  meta: z.record(z.string(), z.unknown()).default({}),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type CommsStandardInput = z.infer<typeof commsStandardSchema>;
