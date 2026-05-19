import { reads } from "@/lib/supabase/reads";

export type RecentUpdate = {
  kind: "sop" | "document" | "platform_login" | "team_member";
  id: string;
  title: string;
  meta: string;
  href: string;
  updated_at: string;
};

export type HomeStats = {
  active_team: number;
  published_sops: number;
  platform_tools: number;
  documents: number;
  departments: number;
  sparklines: {
    team: number[];
    sops: number[];
    logins: number[];
    documents: number[];
  };
};

export type DepartmentHeadcount = {
  name: string;
  slug: string;
  count: number;
};

export type PlatformHealth = {
  total: number;
  healthy: number;
  expiring: number;
  actionNeeded: number;
  scanLabel: string;
  attention: Array<{
    id: string;
    name: string;
    reason: string;
    severity: "amber" | "rose";
    dueLabel: string;
  }>;
};

export type ActionItem = {
  id: string;
  kind: "sop_stale" | "tool_expiring" | "tool_expired" | "dept_no_lead";
  title: string;
  meta: string;
  href: string;
  severity: "amber" | "rose" | "purple";
};

// Returns counts grouped by week for the last 8 weeks. Used for KPI sparklines.
async function weeklyActivity(
  table: "team_members" | "sops" | "platform_logins" | "documents",
): Promise<number[]> {
  const supabase = await reads();
  const weeks = 8;
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  const { data } = await supabase
    .from(table)
    .select("updated_at")
    .gte("updated_at", since.toISOString());

  type Row = { updated_at: string };
  const buckets = new Array(weeks).fill(0) as number[];
  const now = Date.now();
  for (const row of (data ?? []) as Row[]) {
    const ts = new Date(row.updated_at).getTime();
    const daysAgo = Math.floor((now - ts) / 86_400_000);
    const weekIdx = weeks - 1 - Math.min(weeks - 1, Math.floor(daysAgo / 7));
    if (weekIdx >= 0 && weekIdx < weeks) buckets[weekIdx]++;
  }
  return buckets;
}

export async function getHomeStats(): Promise<HomeStats> {
  const supabase = await reads();
  const [team, sops, logins, docs, depts, teamSpark, sopsSpark, loginsSpark, docsSpark] =
    await Promise.all([
      supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("sops")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),
      supabase
        .from("platform_logins")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),
      supabase.from("departments").select("id", { count: "exact", head: true }),
      weeklyActivity("team_members"),
      weeklyActivity("sops"),
      weeklyActivity("platform_logins"),
      weeklyActivity("documents"),
    ]);
  return {
    active_team: team.count ?? 0,
    published_sops: sops.count ?? 0,
    platform_tools: logins.count ?? 0,
    documents: docs.count ?? 0,
    departments: depts.count ?? 0,
    sparklines: {
      team: teamSpark,
      sops: sopsSpark,
      logins: loginsSpark,
      documents: docsSpark,
    },
  };
}

export async function getHeadcountByDepartment(): Promise<DepartmentHeadcount[]> {
  const supabase = await reads();
  const { data: depts } = await supabase
    .from("departments")
    .select("name, slug, members:team_members!team_members_department_id_fkey(id, is_active)")
    .order("sort_order", { ascending: true });

  type Raw = {
    name: string;
    slug: string;
    members?: { id: string; is_active: boolean }[];
  };
  return ((depts ?? []) as Raw[]).map((d) => ({
    name: d.name,
    slug: d.slug,
    count: (d.members ?? []).filter((m) => m.is_active).length,
  }));
}

export async function getPlatformHealth(): Promise<PlatformHealth> {
  const supabase = await reads();
  const { data } = await supabase
    .from("platform_logins")
    .select("id, tool_name, valid_until, updated_at")
    .order("valid_until", { ascending: true, nullsFirst: false });

  type Row = {
    id: string;
    tool_name: string;
    valid_until: string | null;
    updated_at: string;
  };
  const rows = (data ?? []) as Row[];

  const now = Date.now();
  const THIRTY = 30 * 86_400_000;

  let healthy = 0;
  let expiring = 0;
  let actionNeeded = 0;
  const attention: PlatformHealth["attention"] = [];

  for (const r of rows) {
    if (!r.valid_until) {
      healthy++;
      continue;
    }
    const validTs = new Date(r.valid_until).getTime();
    const diff = validTs - now;
    if (diff < 0) {
      actionNeeded++;
      const daysAgo = Math.round(-diff / 86_400_000);
      attention.push({
        id: r.id,
        name: r.tool_name,
        reason: "Expired",
        severity: "rose",
        dueLabel: `${daysAgo}d ago`,
      });
    } else if (diff < THIRTY) {
      expiring++;
      const days = Math.round(diff / 86_400_000);
      attention.push({
        id: r.id,
        name: r.tool_name,
        reason: "Renewal due",
        severity: "amber",
        dueLabel: `in ${days}d`,
      });
    } else {
      healthy++;
    }
  }

  // Latest "scan" = latest updated_at across the tools (manual edits).
  const latestUpdate = rows.reduce<number>((max, r) => {
    const ts = new Date(r.updated_at).getTime();
    return ts > max ? ts : max;
  }, 0);
  const scanLabel = latestUpdate === 0
    ? "no scans yet"
    : relativeShort(now - latestUpdate);

  return {
    total: rows.length,
    healthy,
    expiring,
    actionNeeded,
    scanLabel: `last update ${scanLabel}`,
    attention: attention.slice(0, 4),
  };
}

function relativeShort(diff: number) {
  const m = Math.round(diff / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.round(d / 7);
  if (w < 5) return `${w}w ago`;
  return `${Math.round(w / 4)}mo ago`;
}

export async function getActionNeeded(): Promise<ActionItem[]> {
  const supabase = await reads();
  const now = Date.now();
  const SIX_MONTHS = 180 * 86_400_000;
  const FOURTEEN_DAYS = 14 * 86_400_000;

  const [sops, logins, depts] = await Promise.all([
    supabase
      .from("sops")
      .select("id, title, slug, last_reviewed_at, updated_at")
      .eq("is_published", true),
    supabase
      .from("platform_logins")
      .select("id, tool_name, valid_until"),
    supabase
      .from("departments")
      .select("id, name, slug, lead_id"),
  ]);

  type SopRow = {
    id: string;
    title: string;
    slug: string;
    last_reviewed_at: string | null;
    updated_at: string;
  };
  type LoginRow = {
    id: string;
    tool_name: string;
    valid_until: string | null;
  };
  type DeptRow = {
    id: string;
    name: string;
    slug: string;
    lead_id: string | null;
  };

  const items: ActionItem[] = [];

  for (const s of (sops.data ?? []) as SopRow[]) {
    const reviewed = s.last_reviewed_at ?? s.updated_at;
    const age = now - new Date(reviewed).getTime();
    if (age > SIX_MONTHS) {
      const months = Math.round(age / (30 * 86_400_000));
      items.push({
        id: `sop-${s.id}`,
        kind: "sop_stale",
        title: s.title,
        meta: `SOP · last reviewed ${months}mo ago`,
        href: `/sops/${s.slug}`,
        severity: "amber",
      });
    }
  }

  for (const l of (logins.data ?? []) as LoginRow[]) {
    if (!l.valid_until) continue;
    const valid = new Date(l.valid_until).getTime();
    const diff = valid - now;
    if (diff < 0) {
      items.push({
        id: `login-${l.id}`,
        kind: "tool_expired",
        title: l.tool_name,
        meta: "Credential expired",
        href: "/platform-logins",
        severity: "rose",
      });
    } else if (diff < FOURTEEN_DAYS) {
      const days = Math.round(diff / 86_400_000);
      items.push({
        id: `login-${l.id}`,
        kind: "tool_expiring",
        title: l.tool_name,
        meta: `Expires in ${days}d`,
        href: "/platform-logins",
        severity: "amber",
      });
    }
  }

  for (const d of (depts.data ?? []) as DeptRow[]) {
    if (!d.lead_id) {
      items.push({
        id: `dept-${d.id}`,
        kind: "dept_no_lead",
        title: d.name,
        meta: "Department has no lead",
        href: `/admin/departments/${d.id}`,
        severity: "purple",
      });
    }
  }

  // Sort by severity (rose > amber > purple) then title
  const rank = { rose: 0, amber: 1, purple: 2 } as const;
  items.sort((a, b) => rank[a.severity] - rank[b.severity]);
  return items.slice(0, 6);
}

export async function getRecentUpdates(limit = 20): Promise<RecentUpdate[]> {
  const supabase = await reads();
  const [sops, docs, logins, team] = await Promise.all([
    supabase
      .from("sops")
      .select("id, slug, title, updated_at, departments(name)")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(limit),
    supabase
      .from("documents")
      .select("id, title, category, updated_at")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(limit),
    supabase
      .from("platform_logins")
      .select("id, tool_name, category, updated_at")
      .order("updated_at", { ascending: false })
      .limit(limit),
    supabase
      .from("team_members")
      .select("id, full_name, role_title, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(limit),
  ]);

  const items: RecentUpdate[] = [
    ...((sops.data ?? []) as Array<{
      id: string;
      slug: string;
      title: string;
      updated_at: string;
      departments: { name: string } | null;
    }>).map((s) => ({
      kind: "sop" as const,
      id: s.id,
      title: s.title,
      meta: `SOP${s.departments?.name ? ` · ${s.departments.name}` : ""}`,
      href: `/sops/${s.slug}`,
      updated_at: s.updated_at,
    })),
    ...((docs.data ?? []) as Array<{
      id: string;
      title: string;
      category: string;
      updated_at: string;
    }>).map((d) => ({
      kind: "document" as const,
      id: d.id,
      title: d.title,
      meta: `Document · ${d.category}`,
      href: `/documents`,
      updated_at: d.updated_at,
    })),
    ...((logins.data ?? []) as Array<{
      id: string;
      tool_name: string;
      category: string;
      updated_at: string;
    }>).map((l) => ({
      kind: "platform_login" as const,
      id: l.id,
      title: l.tool_name,
      meta: `Platform · ${l.category}`,
      href: `/platform-logins`,
      updated_at: l.updated_at,
    })),
    ...((team.data ?? []) as Array<{
      id: string;
      full_name: string;
      role_title: string;
      updated_at: string;
    }>).map((m) => ({
      kind: "team_member" as const,
      id: m.id,
      title: m.full_name,
      meta: `Team · ${m.role_title}`,
      href: `/team/${m.id}`,
      updated_at: m.updated_at,
    })),
  ];

  items.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  return items.slice(0, limit);
}
