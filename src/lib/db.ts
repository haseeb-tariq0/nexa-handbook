// Convenience type helpers over the generated Database type.
// Use these instead of reaching into Database["public"]["Tables"][...] directly.
//
// Why we cast `supabase.from(...) as any` in query files:
// the deeply-nested generated Database type causes the Supabase JS client's
// `.from<T>()` generic to collapse to `never` under strict mode in this
// version. Casting at the from() call boundary unblocks us. The Row<>
// helper below gives us the row shape at the return type so callers stay typed.

import type { Database, Tables } from "@/lib/types/database";

export type DB = Database["public"];
export type Row<T extends keyof DB["Tables"]> = Tables<T>;

export type Department = Row<"departments">;
export type TeamMember = Row<"team_members">;
export type Sop = Row<"sops">;
export type Doc = Row<"documents">;
export type PlatformLogin = Row<"platform_logins">;
export type InternalTool = Row<"internal_tools">;
export type Announcement = Row<"announcements">;
export type MessageTemplate = Row<"message_templates">;
export type OnboardingStep = Row<"onboarding_steps">;
export type OnboardingCompletion = Row<"onboarding_completions">;
export type CommsStandard = Row<"comms_standards">;
export type Profile = Row<"profiles">;
