import Link from "next/link";
import {
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Pencil,
  LogOut,
  ExternalLink,
  Shield,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled, STUB_PROFILE } from "@/lib/auth/dev-bypass";
import { getProfileWithTeam, getDirectReports } from "@/lib/queries/profile";

export const revalidate = 0;

async function resolveIdentity() {
  if (isDevBypassEnabled()) {
    return {
      email: STUB_PROFILE.email,
      full_name: STUB_PROFILE.full_name,
      avatar_url: STUB_PROFILE.avatar_url,
      is_admin: STUB_PROFILE.is_admin,
      last_sign_in_at: null as string | null,
    };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await (supabase.from("profiles") as any)
    .select("email, full_name, avatar_url, is_admin")
    .eq("id", user.id)
    .single();
  return {
    ...(data as {
      email: string;
      full_name: string | null;
      avatar_url: string | null;
      is_admin: boolean;
    }),
    last_sign_in_at: user.last_sign_in_at ?? null,
  };
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ProfilePage() {
  const identity = await resolveIdentity();
  if (!identity) {
    return (
      <EmptyState
        title="Not signed in"
        description="Please sign in to view your profile."
      />
    );
  }

  const team = await getProfileWithTeam(identity.email);
  const directReports = team ? await getDirectReports(team.id) : [];

  return (
    <>
      <PageHeader
        title="My Profile"
        description="How the rest of NEXA sees you across the Handbook and Team Directory."
        actions={
          <>
            {identity.is_admin && (
              <Link
                href={team ? `/admin/team/${team.id}` : "/admin/team"}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-panel border border-border text-[12px] font-medium text-text-1 hover:bg-panel-2 hover:border-border-3 transition"
              >
                <Pencil className="h-3 w-3" />
                Edit profile
              </Link>
            )}
            {team && (
              <Link
                href={`/team/${team.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-text-1 text-white text-[12px] font-medium hover:bg-nexa-purple transition"
              >
                <ExternalLink className="h-3 w-3" />
                View public card
              </Link>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* ─── LEFT: identity + about + contact ─── */}
        <div className="space-y-5 min-w-0">
          {/* Identity card */}
          <Card>
            <CardBody className="p-7">
              <div className="flex items-start gap-5">
                <Avatar
                  name={team?.full_name ?? identity.full_name ?? identity.email}
                  src={identity.avatar_url}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-[18px] font-semibold text-text-1 leading-tight">
                    {team?.full_name ?? identity.full_name ?? identity.email}
                  </h2>
                  {team?.role_title && (
                    <p className="text-[12.5px] text-text-3 mt-0.5">
                      {team.role_title}
                      {team.departments?.name && (
                        <>
                          {" · "}
                          {team.departments.name}
                        </>
                      )}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {team?.location && (
                      <Badge variant="purple">{team.location}</Badge>
                    )}
                    <Badge variant="green">Active</Badge>
                    {identity.is_admin && <Badge variant="amber">Admin</Badge>}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* About */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold">
                  About
                </div>
                <div className="text-[10.5px] text-text-4">
                  Visible to all NEXA staff.
                </div>
              </div>
              {team?.bio ? (
                <p className="text-[13px] text-text-2 leading-relaxed">
                  {team.bio}
                </p>
              ) : (
                <p className="text-[12.5px] text-text-3 italic">
                  No bio yet — ask the Operations Manager to add one.
                </p>
              )}
            </CardBody>
          </Card>

          {/* Contact & Channels */}
          <Card>
            <CardBody>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3">
                Contact &amp; Channels
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Email"
                  value={identity.email}
                  href={`mailto:${identity.email}`}
                />
                {team?.slack_handle && (
                  <InfoRow
                    icon={<MessageSquare className="h-3.5 w-3.5" />}
                    label="Slack"
                    value={team.slack_handle}
                  />
                )}
                {team?.phone && (
                  <InfoRow
                    icon={<Phone className="h-3.5 w-3.5" />}
                    label="Phone"
                    value={team.phone}
                    href={`tel:${team.phone}`}
                  />
                )}
                {team?.whatsapp && (
                  <InfoRow
                    icon={<Phone className="h-3.5 w-3.5" />}
                    label="WhatsApp"
                    value={team.whatsapp}
                    href={`https://wa.me/${team.whatsapp.replace(/\D/g, "")}`}
                  />
                )}
                {team?.working_hours && (
                  <InfoRow
                    icon={<Clock className="h-3.5 w-3.5" />}
                    label="Working hours"
                    value={team.working_hours}
                  />
                )}
                {team?.location && (
                  <InfoRow
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    label="Location"
                    value={team.location}
                  />
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ─── RIGHT: reporting line + security ─── */}
        <div className="space-y-4">
          {/* Reporting Line */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-1.5 mb-3">
                <Users className="h-3 w-3 text-nexa-purple-deep" />
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold">
                  Reporting Line
                </div>
              </div>

              {team?.manager ? (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-text-4 mb-1.5">
                    Manager
                  </div>
                  <Link
                    href={`/team/${(team.manager as { id: string }).id}`}
                    className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-panel-2 transition"
                  >
                    <Avatar
                      name={(team.manager as { full_name: string }).full_name}
                      size="md"
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-text-1 truncate">
                        {(team.manager as { full_name: string }).full_name}
                      </div>
                      <div className="text-[11px] text-text-3 truncate">
                        {(team.manager as { role_title: string }).role_title}
                      </div>
                    </div>
                  </Link>
                </>
              ) : (
                <p className="text-[11.5px] text-text-3 italic mb-2">
                  No manager assigned.
                </p>
              )}

              {directReports.length > 0 && (
                <>
                  <div className="text-[10px] uppercase tracking-wider text-text-4 mt-4 mb-1.5">
                    Direct reports · {directReports.length}
                  </div>
                  <div className="space-y-1 -mx-2">
                    {directReports.map((r) => (
                      <Link
                        key={r.id}
                        href={`/team/${r.id}`}
                        className="flex items-center gap-3 p-2 rounded hover:bg-panel-2 transition"
                      >
                        <Avatar name={r.full_name} size="sm" />
                        <div className="min-w-0">
                          <div className="text-[12.5px] font-medium text-text-1 truncate">
                            {r.full_name}
                          </div>
                          {r.role_title && (
                            <div className="text-[10.5px] text-text-3 truncate">
                              {r.role_title}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </CardBody>
          </Card>

          {/* Department */}
          {team?.departments && (
            <Card>
              <CardBody>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3">
                  Your department
                </div>
                <Link
                  href={`/departments/${team.departments.slug}`}
                  className="text-[13px] font-medium text-text-1 hover:text-nexa-purple transition"
                >
                  {team.departments.name} →
                </Link>
              </CardBody>
            </Card>
          )}

          {!team && (
            <Card>
              <CardBody>
                <p className="text-[12px] text-text-3">
                  You don&rsquo;t have a team directory entry yet. Ask the
                  Operations Manager to add you.
                </p>
              </CardBody>
            </Card>
          )}

          {/* Session & Security */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-1.5 mb-3">
                <Shield className="h-3 w-3 text-nexa-purple-deep" />
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold">
                  Session &amp; Security
                </div>
              </div>

              <SecurityRow label="Signed in via">
                <span className="text-[12px] text-text-1 font-medium">
                  Google SSO
                </span>
              </SecurityRow>
              <SecurityRow label="Two-factor">
                <span className="text-[12px] text-status-green font-semibold">
                  Managed by Google
                </span>
              </SecurityRow>
              <SecurityRow label="Last sign-in">
                <span className="text-[11.5px] text-text-1 font-mono tabular-nums">
                  {formatDate(identity.last_sign_in_at)}
                </span>
              </SecurityRow>

              <form action="/auth/signout" method="post" className="mt-4">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-panel border border-border text-[12px] font-medium text-text-1 hover:bg-panel-2 hover:border-border-3 transition"
                >
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </form>

              <Link
                href="/settings#security"
                className="block mt-2 text-center text-[11px] text-text-3 hover:text-nexa-purple transition"
              >
                Manage in Settings →
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-2">
      <span className="text-text-4 mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[9.5px] uppercase tracking-wider text-text-4">
          {label}
        </div>
        <div className="text-[12.5px] text-text-1 truncate">{value}</div>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        className="block -m-1 p-1 rounded hover:bg-panel-2 transition"
      >
        {content}
      </a>
    );
  }
  return content;
}

function SecurityRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border last:border-b-0">
      <span className="text-[11px] text-text-3">{label}</span>
      {children}
    </div>
  );
}
