import Link from "next/link";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  listMessageTemplates,
  TEMPLATE_CATEGORY_LABELS,
} from "@/lib/queries/comms";
import { deleteMessageTemplate } from "@/app/(app)/admin/templates/actions";

export const revalidate = 0;

export default async function AdminTemplatesPage() {
  const templates = await listMessageTemplates();

  return (
    <>
      <PageHeader
        title="Message templates"
        description="Reusable copy for client + internal comms."
        actions={
          <Link href="/admin/templates/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New template
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Templates
      </div>

      {templates.length === 0 ? (
        <EmptyState title="No templates yet" description="Create the first one." />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_120px_80px_120px] gap-4 px-5 py-3 bg-panel-2 border-b border-border text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
            <div>Title</div>
            <div>Category</div>
            <div>Owner</div>
            <div className="text-right">Uses</div>
            <div className="text-right">Actions</div>
          </div>
          {templates.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[1fr_140px_120px_80px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-text-1 truncate">
                  {t.title}
                </div>
                {t.description && (
                  <div className="text-[11px] text-text-3 truncate mt-0.5">
                    {t.description}
                  </div>
                )}
              </div>
              <div>
                <Badge variant="indigo">
                  {TEMPLATE_CATEGORY_LABELS[t.category] ?? t.category}
                </Badge>
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {t.owner?.full_name ?? <span className="text-text-4">—</span>}
              </div>
              <div className="text-[11.5px] text-text-3 text-right">
                {t.usage_count}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/templates/${t.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={t.title}
                  onDelete={async () => {
                    "use server";
                    return deleteMessageTemplate(t.id);
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
