import { Mail, Hash, Megaphone, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatTile } from "@/components/home/StatTile";
import { CommsTabs } from "@/components/comms/CommsTabs";
import {
  listMessageTemplates,
  listCommsStandards,
  listAnnouncementsArchive,
} from "@/lib/queries/comms";
import { isAdmin } from "@/lib/auth/is-admin";

export const revalidate = 60;

export default async function InternalCommsPage() {
  const [templates, standards, announcements, admin] = await Promise.all([
    listMessageTemplates(),
    listCommsStandards(),
    listAnnouncementsArchive(),
    isAdmin(),
  ]);

  const empty =
    templates.length === 0 &&
    standards.length === 0 &&
    announcements.length === 0;

  const channelCount = standards.filter((s) => s.kind === "channel").length;
  const responseCount = standards.filter(
    (s) => s.kind === "response_standard",
  ).length;

  return (
    <>
      <PageHeader
        title="Internal Communications"
        description="Templates, channel standards, escalation paths, and the agency announcements archive."
      />

      {empty ? (
        <EmptyState
          title="No comms content yet"
          description="The Operations Manager hasn't published anything here."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatTile
              label="Templates"
              value={templates.length}
              hint="Ready to copy"
              icon={<Mail className="h-3.5 w-3.5" />}
              accent="indigo"
            />
            <StatTile
              label="Active channels"
              value={channelCount}
              hint="Slack / email guide"
              icon={<Hash className="h-3.5 w-3.5" />}
              accent="purple"
            />
            <StatTile
              label="Response standards"
              value={responseCount}
              hint="Expected reply times"
              icon={<Clock className="h-3.5 w-3.5" />}
              accent="green"
            />
            <StatTile
              label="Announcements"
              value={announcements.length}
              hint="In archive"
              icon={<Megaphone className="h-3.5 w-3.5" />}
              accent="coral"
            />
          </div>
          <CommsTabs
            templates={templates}
            standards={standards}
            announcements={announcements}
            isAdmin={admin}
          />
        </>
      )}
    </>
  );
}
