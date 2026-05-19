import Link from "next/link";
import { ExternalLink, Zap, CircleDot, Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { listInternalTools } from "@/lib/queries/internal-tools";
import { isAdmin } from "@/lib/auth/is-admin";

export const revalidate = 60;

function cleanUrl(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default async function NexaToolsPage() {
  const [tools, admin] = await Promise.all([listInternalTools(), isAdmin()]);

  return (
    <>
      <PageHeader
        title="NEXA Tools"
        description="The launchpad for every internal platform NEXA has built."
        actions={
          admin ? (
            <Link href="/admin/internal-tools/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                Add a tool
              </Button>
            </Link>
          ) : undefined
        }
      />

      {tools.length === 0 ? (
        <EmptyState
          icon={<Zap className="h-6 w-6" />}
          title="No tools yet"
          description="The Operations Manager hasn't added any internal tools."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map((t) => (
            <div key={t.id} className="relative group">
              {admin && (
                <Link
                  href={`/admin/internal-tools/${t.id}`}
                  className="absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center h-6 w-6 rounded text-text-4 hover:text-nexa-purple hover:bg-nexa-purple-tint transition opacity-0 group-hover:opacity-100"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Pencil className="h-3 w-3" />
                </Link>
              )}
              <a
                href={t.url}
                target="_blank"
                rel="noreferrer"
                className="bg-panel border border-border rounded-lg overflow-hidden hover:border-border-3 transition flex"
              >
                <div
                  className="w-1.5 shrink-0"
                  style={{ background: t.accent_color ?? "#9334FF" }}
                  aria-hidden
                />
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3">
                      <span
                        className="h-11 w-11 rounded-md inline-flex items-center justify-center text-[20px]"
                        style={{
                          background: `${t.accent_color ?? "#9334FF"}15`,
                        }}
                      >
                        {t.icon_emoji ?? "⚡"}
                      </span>
                      <div>
                        <h3 className="text-[14px] font-semibold text-text-1 leading-tight">
                          {t.name}
                        </h3>
                        <div className="text-[10.5px] text-text-3 mt-0.5 font-mono">
                          {cleanUrl(t.url)}
                        </div>
                      </div>
                    </div>
                    {t.is_live && (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-medium text-status-green bg-status-green-bg px-1.5 py-0.5 rounded">
                        <CircleDot className="h-2 w-2" />
                        Live
                      </span>
                    )}
                  </div>

                  {t.description && (
                    <p className="text-[12px] text-text-3 leading-relaxed mt-3 line-clamp-3">
                      {t.description}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11.5px] font-medium"
                      style={{ color: t.accent_color ?? "#9334FF" }}
                    >
                      Open
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
