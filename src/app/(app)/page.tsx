import {
  ListChecks,
  KeyRound,
  Folder,
  Users,
} from "lucide-react";
import Link from "next/link";
import { NewsTicker } from "@/components/home/NewsTicker";
import { StatTile } from "@/components/home/StatTile";
import { Toolbar } from "@/components/home/Toolbar";
import { QuickStrip } from "@/components/home/QuickStrip";
import { RecentUpdates } from "@/components/home/RecentUpdates";
import { DepartmentsStrip } from "@/components/home/DepartmentsStrip";
import { PlatformHealth } from "@/components/home/PlatformHealth";
import { ActionNeeded } from "@/components/home/ActionNeeded";
import { YourDay } from "@/components/home/YourDay";
import { listRecentAnnouncements } from "@/lib/queries/announcements";
import {
  getHomeStats,
  getHeadcountByDepartment,
  getRecentUpdates,
  getPlatformHealth,
  getActionNeeded,
} from "@/lib/queries/home";
import { listDepartments } from "@/lib/queries/departments";
import { getUserFocus } from "@/lib/queries/focus";
import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled, STUB_PROFILE } from "@/lib/auth/dev-bypass";

export const revalidate = 30;

async function resolveCurrentIdentity() {
  if (isDevBypassEnabled()) {
    return { email: STUB_PROFILE.email, userId: null as string | null };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return {
    email: user?.email ?? "",
    userId: user?.id ?? null,
  };
}

export default async function HomePage() {
  const identity = await resolveCurrentIdentity();

  const [
    announcements,
    stats,
    headcount,
    recent,
    departments,
    health,
    actionNeeded,
    focus,
  ] = await Promise.all([
    listRecentAnnouncements(10),
    getHomeStats(),
    getHeadcountByDepartment(),
    getRecentUpdates(20),
    listDepartments(),
    getPlatformHealth(),
    getActionNeeded(),
    getUserFocus(identity.email, identity.userId),
  ]);

  const maxCount = Math.max(1, ...headcount.map((h) => h.count));

  return (
    <div>
      {announcements.length > 0 && <NewsTicker announcements={announcements} />}

      <Toolbar />

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile
          label="Active team"
          value={stats.active_team}
          hint={`${stats.departments} departments`}
          icon={<Users className="h-3.5 w-3.5" />}
          sparkline={stats.sparklines.team}
          accent="rose"
        />
        <StatTile
          label="Published SOPs"
          value={stats.published_sops}
          hint="All departments"
          icon={<ListChecks className="h-3.5 w-3.5" />}
          sparkline={stats.sparklines.sops}
          accent="green"
        />
        <StatTile
          label="Platform logins"
          value={stats.platform_tools}
          hint="Credentials tracked"
          icon={<KeyRound className="h-3.5 w-3.5" />}
          sparkline={stats.sparklines.logins}
          accent="coral"
        />
        <StatTile
          label="Documents"
          value={stats.documents}
          hint="Indexed and linked"
          icon={<Folder className="h-3.5 w-3.5" />}
          sparkline={stats.sparklines.documents}
          accent="indigo"
        />
      </div>

      {/* Bento row 1: Headcount (wide) + Action needed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2 bg-panel border border-border rounded-md p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[13px] font-semibold text-text-1">
                Headcount by department
              </div>
              <div className="text-[11.5px] text-text-3 mt-0.5">
                {stats.active_team} active · {stats.departments} departments
              </div>
            </div>
            <Link
              href="/team"
              className="text-[11.5px] text-text-3 hover:text-nexa-purple transition"
            >
              View team →
            </Link>
          </div>

          {headcount.length === 0 ? (
            <p className="text-[12.5px] text-text-3">No departments yet.</p>
          ) : (
            <div className="space-y-2">
              {headcount.map((d) => (
                <Link
                  key={d.slug}
                  href={`/departments/${d.slug}`}
                  className="grid grid-cols-[160px_1fr_36px] items-center gap-3 group"
                >
                  <span className="text-[12.5px] text-text-2 group-hover:text-text-1 truncate transition">
                    {d.name}
                  </span>
                  <div className="h-1.5 bg-panel-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-nexa-purple rounded-full transition-all"
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-text-1 font-medium text-right">
                    {d.count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <ActionNeeded items={actionNeeded} />
      </div>

      {/* Bento row 2: Platform health + Recent updates + Your day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <PlatformHealth data={health} />
        <RecentUpdates items={recent} />
        <YourDay focus={focus} />
      </div>

      {/* Quick access strip */}
      <div className="mb-6">
        <QuickStrip />
      </div>

      {/* Departments preview */}
      <DepartmentsStrip departments={departments} />
    </div>
  );
}
