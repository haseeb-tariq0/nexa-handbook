import { reads } from "@/lib/supabase/reads";

export type PaletteItem = {
  id: string;
  kind: "page" | "sop" | "person" | "department" | "tool" | "platform" | "document";
  title: string;
  hint?: string;
  href: string;
  keywords?: string;
};

// Static app pages — always available.
const PAGES: PaletteItem[] = [
  { id: "p:home", kind: "page", title: "Home", hint: "Dashboard", href: "/" },
  { id: "p:departments", kind: "page", title: "Departments", href: "/departments" },
  { id: "p:sops", kind: "page", title: "SOPs", hint: "Standard Operating Procedures", href: "/sops" },
  { id: "p:team", kind: "page", title: "Team Directory", href: "/team" },
  { id: "p:onboarding", kind: "page", title: "Onboarding", hint: "First-week checklist", href: "/onboarding" },
  { id: "p:documents", kind: "page", title: "Documents", href: "/documents" },
  { id: "p:platform-logins", kind: "page", title: "Platform Logins", hint: "Credentials & access", href: "/platform-logins" },
  { id: "p:internal-comms", kind: "page", title: "Internal Comms", hint: "Templates & standards", href: "/internal-comms" },
  { id: "p:nexa-tools", kind: "page", title: "NEXA Tools", hint: "Internal product launchpad", href: "/nexa-tools" },
  { id: "p:profile", kind: "page", title: "My Profile", href: "/profile" },
];

export async function loadPaletteIndex(): Promise<PaletteItem[]> {
  const supabase = await reads();

  const [sops, people, depts, tools, platforms, docs] = await Promise.all([
    supabase
      .from("sops")
      .select("id, slug, title, summary")
      .eq("is_published", true),
    supabase
      .from("team_members")
      .select("id, full_name, role_title")
      .eq("is_active", true),
    supabase.from("departments").select("id, slug, name, description"),
    supabase.from("internal_tools").select("id, name, url, description"),
    supabase.from("platform_logins").select("id, tool_name, category, description"),
    supabase
      .from("documents")
      .select("id, title, category, external_url")
      .eq("is_published", true),
  ]);

  const items: PaletteItem[] = [
    ...PAGES,
    ...((sops.data ?? []) as Array<{ id: string; slug: string; title: string; summary: string | null }>).map(
      (s) => ({
        id: `sop:${s.id}`,
        kind: "sop" as const,
        title: s.title,
        hint: s.summary ?? "SOP",
        href: `/sops/${s.slug}`,
        keywords: s.summary ?? undefined,
      }),
    ),
    ...((people.data ?? []) as Array<{ id: string; full_name: string; role_title: string }>).map(
      (p) => ({
        id: `person:${p.id}`,
        kind: "person" as const,
        title: p.full_name,
        hint: p.role_title,
        href: `/team/${p.id}`,
        keywords: p.role_title,
      }),
    ),
    ...((depts.data ?? []) as Array<{ id: string; slug: string; name: string; description: string | null }>).map(
      (d) => ({
        id: `dept:${d.id}`,
        kind: "department" as const,
        title: d.name,
        hint: d.description ?? "Department",
        href: `/departments/${d.slug}`,
        keywords: d.description ?? undefined,
      }),
    ),
    ...((tools.data ?? []) as Array<{ id: string; name: string; url: string; description: string | null }>).map(
      (t) => ({
        id: `tool:${t.id}`,
        kind: "tool" as const,
        title: t.name,
        hint: t.description ?? "Internal tool",
        href: "/nexa-tools",
        keywords: t.url,
      }),
    ),
    ...((platforms.data ?? []) as Array<{ id: string; tool_name: string; category: string; description: string | null }>).map(
      (p) => ({
        id: `platform:${p.id}`,
        kind: "platform" as const,
        title: p.tool_name,
        hint: p.description ?? `Platform · ${p.category}`,
        href: "/platform-logins",
        keywords: p.category,
      }),
    ),
    ...((docs.data ?? []) as Array<{ id: string; title: string; category: string; external_url: string }>).map(
      (d) => ({
        id: `doc:${d.id}`,
        kind: "document" as const,
        title: d.title,
        hint: `Document · ${d.category}`,
        href: "/documents",
        keywords: d.category,
      }),
    ),
  ];

  return items;
}
