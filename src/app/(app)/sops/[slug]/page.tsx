import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Clock, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Markdown } from "@/components/ui/Markdown";
import { getSopBySlug, listRelatedSops } from "@/lib/queries/sops";

export const revalidate = 60;

function formatDate(iso: string | null) {
  if (!iso) return "Never reviewed";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function SopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sop = await getSopBySlug(slug);
  if (!sop) notFound();

  const related = sop.department_id
    ? await listRelatedSops(sop.department_id, sop.id)
    : [];

  return (
    <>
      <Link
        href="/sops"
        className="inline-flex items-center gap-1.5 text-[12.5px] text-text-3 hover:text-text-1 mb-4 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All SOPs
      </Link>

      <PageHeader
        title={sop.title}
        description={sop.summary ?? undefined}
        actions={
          sop.external_link ? (
            <a
              href={sop.external_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-text-1 text-white text-[12px] font-medium hover:bg-nexa-purple transition"
            >
              <ExternalLink className="h-3 w-3" />
              Open external version
            </a>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Body */}
        <Card>
          <CardBody className="px-7 py-6">
            {sop.body ? (
              <Markdown source={sop.body} />
            ) : (
              <p className="text-[13px] text-text-3 italic">
                No body content. {sop.external_link ? "Open the external version above." : ""}
              </p>
            )}
          </CardBody>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3">
                Meta
              </div>
              <div className="space-y-3 text-[12px]">
                {sop.departments && (
                  <div>
                    <div className="text-text-4 mb-1 uppercase tracking-wider text-[10px]">
                      Department
                    </div>
                    <Link
                      href={`/departments/${sop.departments.slug}`}
                      className="text-text-1 hover:text-nexa-purple transition"
                    >
                      <Badge variant="purple">{sop.departments.name}</Badge>
                    </Link>
                  </div>
                )}
                <div>
                  <div className="text-text-4 mb-1 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <User className="h-2.5 w-2.5" />
                    Owner
                  </div>
                  {sop.owner ? (
                    <Link
                      href={`/team/${sop.owner.id}`}
                      className="flex items-center gap-2 -mx-1 px-1 py-1 rounded hover:bg-panel-2 transition"
                    >
                      <Avatar name={sop.owner.full_name} src={sop.owner.avatar_url} size="sm" />
                      <span className="text-text-1 text-[12.5px] font-medium">
                        {sop.owner.full_name}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-text-3">Unassigned</span>
                  )}
                </div>
                <div>
                  <div className="text-text-4 mb-1 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    Last reviewed
                  </div>
                  <span className="text-text-1 text-[12.5px]">
                    {formatDate(sop.last_reviewed_at)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {related.length > 0 && (
            <Card>
              <CardBody>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-3">
                  Related SOPs
                </div>
                <div className="space-y-1 -mx-2">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/sops/${r.slug}`}
                      className="flex items-start justify-between gap-2 p-2 rounded hover:bg-panel-2 group transition"
                    >
                      <span className="text-[12px] text-text-1 group-hover:text-nexa-purple transition line-clamp-2">
                        {r.title}
                      </span>
                      <ArrowRight className="h-3 w-3 text-text-4 group-hover:text-nexa-purple shrink-0 mt-0.5 transition" />
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
