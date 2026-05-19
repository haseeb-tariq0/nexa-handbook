import Link from "next/link";
import { Plus, Pencil, ChevronRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listInternalTools } from "@/lib/queries/internal-tools";
import { deleteInternalTool } from "@/app/(app)/admin/internal-tools/actions";

export const revalidate = 0;

export default async function AdminInternalToolsPage() {
  const tools = await listInternalTools();

  return (
    <>
      <PageHeader
        title="NEXA tools"
        description="Internal products on the launchpad."
        actions={
          <Link href="/admin/internal-tools/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New tool
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        NEXA tools
      </div>

      {tools.length === 0 ? (
        <EmptyState title="No tools yet" description="Add the first one." />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          {tools.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[1fr_180px_80px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="h-8 w-8 rounded-md inline-flex items-center justify-center text-[16px]"
                  style={{ background: `${t.accent_color ?? "#9334FF"}20` }}
                >
                  {t.icon_emoji ?? "⚡"}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-text-1 truncate">
                    {t.name}
                  </div>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] text-text-3 hover:text-nexa-purple font-mono transition"
                  >
                    {t.url}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
              <div className="text-[11.5px] text-text-3 truncate">
                {t.description ?? <span className="text-text-4">—</span>}
              </div>
              <div>
                <span
                  className={
                    t.is_live
                      ? "inline-flex items-center text-[10px] font-semibold text-status-green bg-status-green-bg px-1.5 py-0.5 rounded"
                      : "inline-flex items-center text-[10px] font-semibold text-text-3 bg-panel-2 px-1.5 py-0.5 rounded"
                  }
                >
                  {t.is_live ? "Live" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/internal-tools/${t.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={t.name}
                  onDelete={async () => {
                    "use server";
                    return deleteInternalTool(t.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
