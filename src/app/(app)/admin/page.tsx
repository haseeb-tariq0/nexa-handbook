import Link from "next/link";
import {
  Building2,
  Users,
  ListChecks,
  Folder,
  KeyRound,
  Zap,
  Megaphone,
  Mail,
  Compass,
  Hash,
  ShieldCheck,
  Video,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { getEntityCounts, type EntityCount } from "@/lib/queries/admin";
import { listProfiles, getAdminEmailList } from "@/lib/queries/users";

const ENTITY_META: Record<
  EntityCount["table"],
  {
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    ready: boolean;
  }
> = {
  departments: {
    label: "Departments",
    description: "Team structure, leads, expertise, key tools.",
    icon: Building2,
    href: "/admin/departments",
    ready: true,
  },
  team_members: {
    label: "Team members",
    description: "Directory entries — name, role, department, contact.",
    icon: Users,
    href: "/admin/team",
    ready: true,
  },
  sops: {
    label: "SOPs",
    description: "Standard operating procedures, by department.",
    icon: ListChecks,
    href: "/admin/sops",
    ready: true,
  },
  documents: {
    label: "Documents",
    description: "Brand, templates, policies, onboarding packs.",
    icon: Folder,
    href: "/admin/documents",
    ready: true,
  },
  platform_logins: {
    label: "Platform logins",
    description: "Tools NEXA pays for, credentials, access notes.",
    icon: KeyRound,
    href: "/admin/platform-logins",
    ready: true,
  },
  internal_tools: {
    label: "NEXA tools",
    description: "Internal products on the launchpad.",
    icon: Zap,
    href: "/admin/internal-tools",
    ready: true,
  },
  announcements: {
    label: "Announcements",
    description: "Ticker items + comms archive.",
    icon: Megaphone,
    href: "/admin/announcements",
    ready: true,
  },
  message_templates: {
    label: "Message templates",
    description: "Reusable copy for client + internal comms.",
    icon: Mail,
    href: "/admin/templates",
    ready: true,
  },
  onboarding_steps: {
    label: "Onboarding steps",
    description: "Day-1 to Day-5 checklist for new starters.",
    icon: Compass,
    href: "/admin/onboarding-steps",
    ready: true,
  },
  onboarding_videos: {
    label: "Onboarding videos",
    description: "Training videos shown on the Onboarding page (URLs only).",
    icon: Video,
    href: "/admin/onboarding-videos",
    ready: true,
  },
  comms_standards: {
    label: "Comms standards",
    description: "Channels, response times, meeting rules, escalation paths.",
    icon: Hash,
    href: "/admin/comms-standards",
    ready: true,
  },
};

export default async function AdminHomePage() {
  const [counts, profiles, adminEmails] = await Promise.all([
    getEntityCounts(),
    listProfiles(),
    Promise.resolve(getAdminEmailList()),
  ]);
  const adminCount = profiles.filter((p) => p.is_admin).length;

  return (
    <>
      <PageHeader
        title="Admin"
        description="Create, edit, and remove content across the Handbook. Only Admins see this."
      />

      {/* Users & access — sits above the content entities */}
      <Link href="/admin/users" className="block mb-6">
        <Card interactive>
          <CardBody>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="h-9 w-9 rounded-md bg-nexa-purple-tint text-nexa-purple inline-flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13.5px] font-semibold text-text-1">
                    Users &amp; access
                  </h3>
                  <p className="text-[11.5px] text-text-3 mt-0.5 leading-relaxed">
                    {profiles.length} signed-in user{profiles.length === 1 ? "" : "s"}
                    {" · "}
                    {adminCount} admin{adminCount === 1 ? "" : "s"}
                    {" · "}
                    {adminEmails.length} email{adminEmails.length === 1 ? "" : "s"} in ADMIN_EMAILS
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-text-4 shrink-0 mt-1" />
            </div>
          </CardBody>
        </Card>
      </Link>

      <div className="text-[10.5px] uppercase tracking-[0.14em] text-text-4 font-semibold mb-3">
        Content
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {counts.map(({ table, count }) => {
          const meta = ENTITY_META[table];
          const Icon = meta.icon;
          const card = (
            <div
              key={table}
              className={`relative bg-panel border border-border rounded-md p-5 transition ${
                meta.ready ? "hover:border-nexa-purple hover:shadow-sm" : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="h-9 w-9 rounded-md bg-panel-2 text-text-2 inline-flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11.5px] text-text-3 bg-panel-2 px-2 py-0.5 rounded">
                  {count}
                </span>
              </div>
              <h3 className="text-[13.5px] font-semibold text-text-1">
                {meta.label}
              </h3>
              <p className="text-[11.5px] text-text-3 mt-1 leading-relaxed line-clamp-2">
                {meta.description}
              </p>
              {!meta.ready && (
                <span className="absolute top-3 right-3 inline-flex items-center px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold text-text-4 bg-panel-2 border border-border rounded">
                  Soon
                </span>
              )}
            </div>
          );
          return meta.ready ? (
            <Link key={table} href={meta.href}>
              {card}
            </Link>
          ) : (
            card
          );
        })}
      </div>

    </>
  );
}
