import { reads } from "@/lib/supabase/reads";

export type FocusItem = {
  id: string;
  title: string;
  meta: string;
  href: string;
  kind: "sop" | "tool" | "onboarding" | "announcement";
};

export type UserFocus = {
  greeting: string;
  firstName: string;
  items: FocusItem[];
};

function timeOfDayGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export async function getUserFocus(
  email: string,
  userId: string | null,
): Promise<UserFocus> {
  const supabase = await reads();

  // Find team_member row by email so we can scope owned content
  const { data: tm } = await supabase
    .from("team_members")
    .select("id, full_name")
    .eq("email", email)
    .maybeSingle();

  type TmRow = { id: string; full_name: string } | null;
  const teamMember = tm as TmRow;
  const teamId = teamMember?.id ?? null;
  const firstName = (teamMember?.full_name ?? email.split("@")[0]).split(/\s+/)[0];

  const items: FocusItem[] = [];

  // SOPs the user owns that are stale (> 90 days since last_reviewed_at / updated_at)
  if (teamId) {
    const NINETY = 90 * 86_400_000;
    const since = new Date(Date.now() - NINETY).toISOString();
    const { data: sops } = await supabase
      .from("sops")
      .select("id, title, slug, last_reviewed_at, updated_at")
      .eq("owner_id", teamId)
      .eq("is_published", true)
      .lt("last_reviewed_at", since);
    type SopRow = {
      id: string;
      title: string;
      slug: string;
      last_reviewed_at: string | null;
      updated_at: string;
    };
    for (const s of (sops ?? []) as SopRow[]) {
      const ref = s.last_reviewed_at ?? s.updated_at;
      const ageDays = Math.round(
        (Date.now() - new Date(ref).getTime()) / 86_400_000,
      );
      items.push({
        kind: "sop",
        id: s.id,
        title: s.title,
        meta: `Review your SOP · ${ageDays}d since last review`,
        href: `/sops/${s.slug}`,
      });
    }

    // Platform tools the user manages, expiring < 30d
    const THIRTY = 30 * 86_400_000;
    const horizon = new Date(Date.now() + THIRTY).toISOString();
    const { data: tools } = await supabase
      .from("platform_logins")
      .select("id, tool_name, valid_until")
      .eq("managed_by_id", teamId)
      .not("valid_until", "is", null)
      .lt("valid_until", horizon);
    type ToolRow = {
      id: string;
      tool_name: string;
      valid_until: string | null;
    };
    for (const t of (tools ?? []) as ToolRow[]) {
      if (!t.valid_until) continue;
      const days = Math.round(
        (new Date(t.valid_until).getTime() - Date.now()) / 86_400_000,
      );
      items.push({
        kind: "tool",
        id: t.id,
        title: t.tool_name,
        meta:
          days < 0
            ? `Tool you manage · expired ${-days}d ago`
            : `Tool you manage · renews in ${days}d`,
        href: `/admin/platform-logins/${t.id}`,
      });
    }
  }

  // Incomplete onboarding steps (only when we have a real profile id)
  if (userId) {
    const { data: completed } = await supabase
      .from("onboarding_completions")
      .select("step_id")
      .eq("user_id", userId);
    const done = new Set(
      ((completed ?? []) as { step_id: string }[]).map((r) => r.step_id),
    );
    const { data: steps } = await supabase
      .from("onboarding_steps")
      .select("id, title, day_label, sort_order")
      .order("sort_order", { ascending: true });
    type StepRow = {
      id: string;
      title: string;
      day_label: string;
      sort_order: number;
    };
    const pending = ((steps ?? []) as StepRow[])
      .filter((s) => !done.has(s.id))
      .slice(0, 2);
    for (const s of pending) {
      items.push({
        kind: "onboarding",
        id: s.id,
        title: s.title,
        meta: `Onboarding · ${s.day_label}`,
        href: "/onboarding",
      });
    }
  }

  // Most recent pinned announcement, if any (always shown if present)
  const { data: pinned } = await supabase
    .from("announcements")
    .select("id, title, body")
    .eq("is_pinned", true)
    .order("published_at", { ascending: false })
    .limit(1);
  type PinnedRow = { id: string; title: string; body: string };
  for (const a of (pinned ?? []) as PinnedRow[]) {
    items.unshift({
      kind: "announcement",
      id: a.id,
      title: a.title,
      meta: `Pinned announcement · ${a.body.slice(0, 60)}${a.body.length > 60 ? "…" : ""}`,
      href: "/internal-comms#announcements",
    });
  }

  return {
    greeting: timeOfDayGreeting(),
    firstName,
    items: items.slice(0, 5),
  };
}
