import { reads } from "@/lib/supabase/reads";

export type EntityCount = {
  table:
    | "departments"
    | "team_members"
    | "sops"
    | "documents"
    | "platform_logins"
    | "internal_tools"
    | "announcements"
    | "message_templates"
    | "onboarding_steps"
    | "onboarding_videos"
    | "comms_standards";
  count: number;
};

const TABLES: EntityCount["table"][] = [
  "departments",
  "team_members",
  "sops",
  "documents",
  "platform_logins",
  "internal_tools",
  "announcements",
  "message_templates",
  "onboarding_steps",
  "onboarding_videos",
  "comms_standards",
];

export async function getEntityCounts(): Promise<EntityCount[]> {
  const supabase = await reads();
  const results = await Promise.all(
    TABLES.map(async (table) => {
      const { count } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      return { table, count: count ?? 0 } as EntityCount;
    }),
  );
  return results;
}
