import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, MessageSquare, Phone, MapPin, Clock, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  getTeamMemberById,
  getDirectReports,
} from "@/lib/queries/team";

export const revalidate = 60;

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();

  const [manager, reports] = await Promise.all([
    member.reports_to ? getTeamMemberById(member.reports_to) : Promise.resolve(null),
    getDirectReports(member.id),
  ]);

  return (
    <>
      <Link
        href="/team"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-text-3 hover:text-text-1 mb-4 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Team Directory
      </Link>

      <PageHeader title={member.full_name} description={member.role_title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-start gap-5">
              <Avatar name={member.full_name} src={member.avatar_url} size="lg" />
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 items-center">
                  {member.departments?.name && (
                    <Badge variant="purple">{member.departments.name}</Badge>
                  )}
                  {member.location && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-text-3">
                      <MapPin className="h-3 w-3" /> {member.location}
                    </span>
                  )}
                  {member.working_hours && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-text-3">
                      <Clock className="h-3 w-3" /> {member.working_hours}
                    </span>
                  )}
                </div>

                {member.bio && (
                  <p className="mt-4 text-[13px] text-text-2 leading-relaxed">
                    {member.bio}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <ContactButton
                    href={`mailto:${member.email}`}
                    icon={<Mail className="h-3.5 w-3.5" />}
                    label={member.email}
                  />
                  {member.slack_handle && (
                    <ContactButton
                      href={`slack://user?team=&id=${member.slack_handle}`}
                      icon={<MessageSquare className="h-3.5 w-3.5" />}
                      label={member.slack_handle}
                    />
                  )}
                  {member.phone && (
                    <ContactButton
                      href={`tel:${member.phone}`}
                      icon={<Phone className="h-3.5 w-3.5" />}
                      label={member.phone}
                    />
                  )}
                  {member.whatsapp && (
                    <ContactButton
                      href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
                      icon={<Phone className="h-3.5 w-3.5" />}
                      label="WhatsApp"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3">
              Reporting line
            </div>

            {manager ? (
              <Link
                href={`/team/${manager.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-panel-2 transition"
              >
                <Avatar name={manager.full_name} src={manager.avatar_url} size="sm" />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium text-text-1 truncate">
                    {manager.full_name}
                  </div>
                  <div className="text-[10.5px] text-text-3 truncate">
                    Manager · {manager.role_title}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="text-[12px] text-text-3">No manager set (root).</div>
            )}

            {reports.length > 0 && (
              <>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mt-5 mb-2">
                  Direct reports ({reports.length})
                </div>
                <div className="space-y-0.5">
                  {reports.map((r) => (
                    <Link
                      key={r.id}
                      href={`/team/${r.id}`}
                      className="flex items-center justify-between p-2 -mx-2 rounded hover:bg-panel-2 transition"
                    >
                      <span className="text-[12.5px] text-text-1">
                        {r.full_name}
                      </span>
                      <span className="text-[10.5px] text-text-3 truncate ml-2">
                        {r.role_title}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function ContactButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-panel-2 hover:bg-nexa-purple-tint text-[12px] text-text-2 hover:text-nexa-purple border border-border transition"
    >
      {icon}
      {label}
    </a>
  );
}
