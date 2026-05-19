import {
  User,
  Bell,
  Eye,
  Globe,
  Shield,
  AlertTriangle,
  LogOut,
  Mail,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled, STUB_PROFILE } from "@/lib/auth/dev-bypass";
import { ReduceMotionToggle } from "@/components/settings/ReduceMotionToggle";

export const revalidate = 0;

const WORKSPACE_DOMAIN =
  process.env.NEXT_PUBLIC_WORKSPACE_DOMAIN ?? "digitalnexa.com";

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
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SECTIONS: { id: string; label: string; icon: typeof User }[] = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Eye },
  { id: "language", label: "Language & Region", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
  { id: "danger", label: "Danger zone", icon: AlertTriangle },
];

export default async function SettingsPage() {
  const identity = await resolveIdentity();

  if (!identity) {
    return (
      <Card>
        <CardBody>
          <p className="text-[13px] text-text-3">
            Please sign in to access settings.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account, appearance and access — all in one place."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        {/* Section nav */}
        <nav className="lg:sticky lg:top-6 self-start">
          <ul className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[12.5px] text-text-2 hover:bg-panel-2 hover:text-text-1 transition whitespace-nowrap"
                  >
                    <Icon className="h-3.5 w-3.5 text-text-4" />
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sections */}
        <div className="space-y-5 min-w-0">
          {/* ─── ACCOUNT ─── */}
          <section id="account" className="scroll-mt-6">
            <SectionHead icon={<User className="h-3.5 w-3.5" />} title="Account" />
            <Card>
              <CardBody>
                <div className="flex items-center gap-4">
                  <Avatar
                    name={identity.full_name ?? identity.email}
                    src={identity.avatar_url}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold text-text-1 truncate">
                      {identity.full_name ?? identity.email}
                    </div>
                    <div className="text-[12px] text-text-3 truncate">
                      {identity.email}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {identity.is_admin ? (
                        <Badge variant="amber">Admin</Badge>
                      ) : (
                        <Badge variant="purple">Member</Badge>
                      )}
                      <Badge variant="green">Active</Badge>
                    </div>
                  </div>
                </div>

                <Divider />

                <Row
                  label="Sign-in method"
                  hint="All authentication runs through Google Workspace SSO."
                >
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-panel-2 border border-border text-[12px] text-text-1 font-medium">
                    <GoogleMark />
                    Google SSO
                  </div>
                </Row>

                <Row label="Workspace" hint="Only verified NEXA emails can sign in.">
                  <span className="text-[12.5px] text-text-1 font-medium">
                    @{WORKSPACE_DOMAIN}
                  </span>
                </Row>
              </CardBody>
            </Card>
          </section>

          {/* ─── NOTIFICATIONS ─── */}
          <section id="notifications" className="scroll-mt-6">
            <SectionHead
              icon={<Bell className="h-3.5 w-3.5" />}
              title="Notifications"
            />
            <Card>
              <CardBody>
                <p className="text-[12.5px] text-text-3 leading-relaxed">
                  Internal notifications are delivered via the announcement
                  ticker on the dashboard. Email digests are not enabled — check
                  back here when they ship.
                </p>
              </CardBody>
            </Card>
          </section>

          {/* ─── APPEARANCE ─── */}
          <section id="appearance" className="scroll-mt-6">
            <SectionHead
              icon={<Eye className="h-3.5 w-3.5" />}
              title="Appearance"
            />
            <Card>
              <CardBody>
                <Row
                  label="Reduce motion"
                  hint="Disables the news ticker animation and card hover lifts."
                >
                  <ReduceMotionToggle />
                </Row>
              </CardBody>
            </Card>
          </section>

          {/* ─── LANGUAGE & REGION ─── */}
          <section id="language" className="scroll-mt-6">
            <SectionHead
              icon={<Globe className="h-3.5 w-3.5" />}
              title="Language & Region"
            />
            <Card>
              <CardBody>
                <Row label="Language" hint="Interface language for the Handbook.">
                  <StaticPill>English (UK)</StaticPill>
                </Row>
                <Row
                  label="Timezone"
                  hint='Used for "last updated" timestamps across the app.'
                >
                  <StaticPill>Asia / Dubai (GST, UTC+4)</StaticPill>
                </Row>
                <Row
                  label="Date format"
                  hint="How dates appear across the Handbook."
                >
                  <StaticPill>DD MMM YYYY</StaticPill>
                </Row>
              </CardBody>
            </Card>
          </section>

          {/* ─── SECURITY ─── */}
          <section id="security" className="scroll-mt-6">
            <SectionHead
              icon={<Shield className="h-3.5 w-3.5" />}
              title="Security"
            />
            <Card>
              <CardBody>
                <Row
                  label="Sign-in method"
                  hint="All authentication runs through Google Workspace SSO."
                >
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-panel-2 border border-border text-[12px] text-text-1 font-medium">
                    <GoogleMark />
                    Google SSO
                  </div>
                </Row>
                <Row
                  label="Two-factor authentication"
                  hint="Enforced by IT — managed on your Google account."
                >
                  <span className="text-[12px] text-status-green font-semibold">
                    Managed by Google
                  </span>
                </Row>
                <Row
                  label="Last sign-in"
                  hint="Most recent successful sign-in to the Handbook."
                >
                  <span className="text-[12.5px] text-text-1 font-medium font-mono tabular-nums">
                    {formatDate(identity.last_sign_in_at)}
                  </span>
                </Row>
              </CardBody>
            </Card>
          </section>

          {/* ─── DANGER ZONE ─── */}
          <section id="danger" className="scroll-mt-6">
            <SectionHead
              icon={<AlertTriangle className="h-3.5 w-3.5 text-status-rose" />}
              title="Danger zone"
              tone="rose"
            />
            <Card className="border-status-rose/20">
              <CardBody>
                <Row
                  label="Sign out of this device"
                  hint="Ends your current session on this browser."
                >
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-panel border border-border text-[12px] font-medium text-text-1 hover:bg-panel-2 hover:border-border-3 transition"
                    >
                      <LogOut className="h-3 w-3" />
                      Sign out
                    </button>
                  </form>
                </Row>

                <Row
                  label="Request access removal"
                  hint="When you leave NEXA, IT revokes access through Google Workspace. There is nothing to delete here."
                >
                  <a
                    href="mailto:it@digitalnexa.com?subject=Handbook%20access%20removal"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-panel border border-border text-[12px] font-medium text-text-1 hover:bg-panel-2 hover:border-border-3 transition"
                  >
                    <Mail className="h-3 w-3" />
                    Contact IT
                  </a>
                </Row>
              </CardBody>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */
/* Inline helpers — these don't get reused anywhere else, keep them here.    */
/* ──────────────────────────────────────────────────────────────────────── */

function SectionHead({
  icon,
  title,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  tone?: "rose";
}) {
  return (
    <div className="flex items-center gap-2 mb-2 px-1">
      <span
        className={
          tone === "rose"
            ? "inline-flex h-6 w-6 items-center justify-center rounded bg-status-rose-bg text-status-rose"
            : "inline-flex h-6 w-6 items-center justify-center rounded bg-nexa-purple-tint text-nexa-purple-deep"
        }
      >
        {icon}
      </span>
      <h2 className="text-[13.5px] font-semibold text-text-1">{title}</h2>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 first:pt-1 last:pb-1 border-b border-border last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-medium text-text-1">{label}</div>
        {hint && (
          <div className="text-[11.5px] text-text-3 mt-0.5 leading-relaxed">
            {hint}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border my-4" />;
}

function StaticPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-panel-2 border border-border text-[12px] text-text-1 font-medium">
      {children}
    </span>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}
