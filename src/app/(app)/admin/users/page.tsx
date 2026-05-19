import Link from "next/link";
import { ChevronRight, ShieldCheck, ShieldOff, Info, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { IntendedAdminToggle } from "@/components/admin/IntendedAdminToggle";
import { listProfiles, getAdminEmailList } from "@/lib/queries/users";
import { listActiveTeam } from "@/lib/queries/team";
import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled, STUB_PROFILE } from "@/lib/auth/dev-bypass";

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function currentUserEmail(): Promise<string> {
  if (isDevBypassEnabled()) return STUB_PROFILE.email;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? "";
}

export default async function AdminUsersPage() {
  const [profiles, team, adminEmails, currentEmail] = await Promise.all([
    listProfiles(),
    listActiveTeam(),
    Promise.resolve(getAdminEmailList()),
    currentUserEmail(),
  ]);
  const admins = profiles.filter((p) => p.is_admin);
  const members = profiles.filter((p) => !p.is_admin);

  const signedInEmails = new Set(profiles.map((p) => p.email.toLowerCase()));
  const expected = team.filter(
    (m) => !signedInEmails.has(m.email.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Users & access"
        description="Promote or demote anyone who has signed in. ADMIN_EMAILS seeds the admin list on first sign-in; the UI takes over after that."
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Users
      </div>

      <Card className="mb-6">
        <CardBody>
          <div className="flex items-start gap-3 mb-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-status-amber-bg text-status-amber shrink-0">
              <Info className="h-3.5 w-3.5" />
            </span>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-text-1">
                How admin access works
              </div>
              <p className="text-[11.5px] text-text-3 mt-0.5 leading-relaxed">
                <code className="text-text-1 bg-panel-2 border border-border rounded px-1 py-px font-mono text-[11px]">
                  ADMIN_EMAILS
                </code>{" "}
                seeds the initial admin list on a user&rsquo;s first sign-in.
                After that, use the toggle on each row below to promote or
                demote. Changes take effect immediately. You cannot demote
                yourself.
              </p>
            </div>
          </div>
          <div className="bg-panel-2 border border-border rounded p-3 font-mono text-[11.5px] text-text-1 break-all">
            ADMIN_EMAILS={adminEmails.length === 0 ? "(empty)" : adminEmails.join(",")}
          </div>
        </CardBody>
      </Card>

      <div className="space-y-6">
        <UserSection
          title={`Admins · ${admins.length}`}
          users={admins}
          currentEmail={currentEmail}
          emptyText="No admins have signed in yet."
        />
        <UserSection
          title={`Members · ${members.length}`}
          users={members}
          currentEmail={currentEmail}
          emptyText="No members have signed in yet."
        />
        <ExpectedSection team={expected} adminEmails={adminEmails} />
      </div>
    </>
  );
}

function UserSection({
  title,
  users,
  currentEmail,
  emptyText,
}: {
  title: string;
  users: Awaited<ReturnType<typeof listProfiles>>;
  currentEmail: string;
  emptyText: string;
}) {
  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-3 mb-2">
        {title}
      </h2>
      {users.length === 0 ? (
        <div className="bg-panel border border-dashed border-border rounded-md py-6 text-center">
          <p className="text-[12px] text-text-3">{emptyText}</p>
        </div>
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          {users.map((u) => {
            const isSelf = u.email.toLowerCase() === currentEmail.toLowerCase();
            return (
              <div
                key={u.id}
                className="grid grid-cols-[1fr_180px_140px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    name={u.full_name ?? u.email}
                    src={u.avatar_url}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-text-1 truncate flex items-center gap-1.5">
                      {u.full_name ?? u.email.split("@")[0]}
                      {isSelf && (
                        <span className="text-[9.5px] uppercase tracking-wider text-text-4 bg-panel-2 px-1.5 py-px rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[10.5px] text-text-4 truncate font-mono">
                      {u.email}
                    </div>
                  </div>
                </div>
                <div>
                  {u.team_member ? (
                    <Link
                      href={`/admin/team/${u.team_member.id}`}
                      className="text-[11.5px] text-text-2 hover:text-nexa-purple transition truncate"
                    >
                      {u.team_member.role_title}
                    </Link>
                  ) : (
                    <span className="text-[11px] text-text-4 italic">
                      No directory entry
                    </span>
                  )}
                </div>
                <div>
                  <AdminToggle
                    userId={u.id}
                    isAdmin={u.is_admin}
                    disabled={isSelf}
                    reason={isSelf ? "You can't demote yourself" : undefined}
                  />
                </div>
                <div className="text-[11px] text-text-3 text-right">
                  {formatDate(u.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ExpectedSection({
  team,
  adminEmails,
}: {
  team: Awaited<ReturnType<typeof listActiveTeam>>;
  adminEmails: string[];
}) {
  if (team.length === 0) return null;

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-3 mb-2 inline-flex items-center gap-2">
        <Clock className="h-3 w-3" />
        Expected · {team.length}
      </h2>
      <p className="text-[11.5px] text-text-3 mb-3">
        Directory entries waiting for first sign-in. Toggle each row to set
        their role for when they sign in. An explicit toggle overrides{" "}
        <code className="text-text-1 bg-panel-2 border border-border rounded px-1 font-mono text-[10.5px]">
          ADMIN_EMAILS
        </code>
        ; if you don&rsquo;t toggle, that env list is the fallback.
      </p>
      <div className="bg-panel border border-border rounded-md overflow-hidden">
        {team.map((m) => {
          const inEnv = adminEmails.includes(m.email.toLowerCase());
          // intended_admin is tri-state: null = use env, true/false = explicit
          const effective =
            m.intended_admin === null || m.intended_admin === undefined
              ? inEnv
              : m.intended_admin;
          return (
            <div
              key={m.id}
              className="grid grid-cols-[1fr_180px_160px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={m.full_name} src={m.avatar_url} size="sm" />
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-text-1 truncate">
                    {m.full_name}
                  </div>
                  <div className="text-[10.5px] text-text-4 truncate font-mono">
                    {m.email}
                  </div>
                </div>
              </div>
              <div>
                <Link
                  href={`/admin/team/${m.id}`}
                  className="text-[11.5px] text-text-2 hover:text-nexa-purple transition truncate"
                >
                  {m.role_title}
                </Link>
              </div>
              <div>
                <IntendedAdminToggle
                  teamMemberId={m.id}
                  intended={effective}
                  envOverride={inEnv && (m.intended_admin === null || m.intended_admin === undefined)}
                />
              </div>
              <div className="text-[10.5px] text-text-4 text-right italic">
                Not signed in
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
