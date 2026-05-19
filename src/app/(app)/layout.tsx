import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/palette/CommandPalette";
import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled, STUB_PROFILE } from "@/lib/auth/dev-bypass";
import { loadPaletteIndex } from "@/lib/queries/palette";
import { getProfileWithTeam } from "@/lib/queries/profile";
import { listRecentAnnouncements } from "@/lib/queries/announcements";

function initialsFrom(name: string | null | undefined, email: string) {
  if (name && name.trim()) {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }
  return email[0]?.toUpperCase() ?? "?";
}

async function resolveProfile() {
  if (isDevBypassEnabled()) {
    return {
      email: STUB_PROFILE.email,
      full_name: STUB_PROFILE.full_name,
      is_admin: STUB_PROFILE.is_admin,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await (supabase.from("profiles") as any)
    .select("full_name, email, is_admin")
    .eq("id", user.id)
    .single();
  const profile = data as {
    full_name: string | null;
    email: string;
    is_admin: boolean;
  } | null;

  return {
    email: profile?.email ?? user.email ?? "",
    full_name: profile?.full_name ?? null,
    is_admin: Boolean(profile?.is_admin),
  };
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await resolveProfile();
  const [paletteItems, teamRow, announcements] = await Promise.all([
    loadPaletteIndex(),
    getProfileWithTeam(profile.email),
    listRecentAnnouncements(6),
  ]);

  // Show the bell-icon dot if there's an announcement from the last 7 days.
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const hasNewAnnouncements = announcements.some(
    (a) => Date.now() - new Date(a.published_at).getTime() < SEVEN_DAYS,
  );

  const displayName = teamRow?.full_name ?? profile.full_name ?? profile.email;
  const role = teamRow?.role_title ?? (profile.is_admin ? "Admin" : "Member");
  const initials = initialsFrom(displayName, profile.email);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar
        isAdmin={profile.is_admin}
        userName={displayName}
        userRole={role}
        userEmail={profile.email}
      />
      <div className="md:ml-[var(--spacing-sidebar)]">
        <TopBar
          userInitials={initials}
          announcements={announcements}
          hasNewAnnouncements={hasNewAnnouncements}
        />
        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
      <CommandPalette items={paletteItems} />
    </div>
  );
}
