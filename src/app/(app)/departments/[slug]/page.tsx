import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Wrench } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  getDepartmentBySlug,
  listDepartmentMembers,
  listDepartmentSops,
} from "@/lib/queries/departments";

export const revalidate = 60;

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  if (!dept) notFound();

  const [members, sops] = await Promise.all([
    listDepartmentMembers(dept.id),
    listDepartmentSops(dept.id),
  ]);

  const lead = Array.isArray(dept.lead) ? dept.lead[0] : dept.lead;

  return (
    <>
      <Link
        href="/departments"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-text-3 hover:text-text-1 mb-4 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Departments
      </Link>

      <PageHeader title={dept.name} description={dept.description ?? undefined} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lead + meta */}
        <div className="space-y-5">
          {lead && (
            <Card>
              <CardBody>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3">
                  Department lead
                </div>
                <Link
                  href={`/team/${lead.id}`}
                  className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-panel-2 transition"
                >
                  <Avatar name={lead.full_name} src={lead.avatar_url} size="md" />
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-text-1 truncate">
                      {lead.full_name}
                    </div>
                    <div className="text-[11.5px] text-text-3 truncate">
                      {lead.role_title}
                    </div>
                  </div>
                </Link>
              </CardBody>
            </Card>
          )}

          {dept.core_expertise.length > 0 && (
            <Card>
              <CardBody>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3">
                  Core expertise
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dept.core_expertise.map((tag: string) => (
                    <Badge key={tag} variant="purple">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {dept.key_tools.length > 0 && (
            <Card>
              <CardBody>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3 flex items-center gap-1.5">
                  <Wrench className="h-3 w-3" />
                  Key tools
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dept.key_tools.map((tool: string) => (
                    <Badge key={tool} variant="default">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Members + SOPs */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardBody>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-4">
                Team ({members.length})
              </div>
              {members.length === 0 ? (
                <p className="text-[12.5px] text-text-3">No active members.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.map((m) => (
                    <Link
                      key={m.id}
                      href={`/team/${m.id}`}
                      className="flex items-center gap-3 p-2.5 -mx-1 rounded-md hover:bg-panel-2 transition"
                    >
                      <Avatar
                        name={m.full_name}
                        src={m.avatar_url}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-medium text-text-1 truncate">
                          {m.full_name}
                        </div>
                        <div className="text-[10.5px] text-text-3 truncate">
                          {m.role_title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-4 flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                SOPs ({sops.length})
              </div>
              {sops.length === 0 ? (
                <p className="text-[12.5px] text-text-3">
                  No published SOPs for this department yet.
                </p>
              ) : (
                <div className="divide-y divide-border -my-3">
                  {sops.map((sop) => (
                    <Link
                      key={sop.id}
                      href={`/sops/${sop.slug}`}
                      className="flex items-start justify-between gap-3 py-3 group"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-text-1 group-hover:text-nexa-purple transition">
                          {sop.title}
                        </div>
                        {sop.summary && (
                          <div className="text-[11.5px] text-text-3 mt-0.5 line-clamp-1">
                            {sop.summary}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-text-4 group-hover:text-nexa-purple shrink-0 mt-1 transition" />
                    </Link>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
