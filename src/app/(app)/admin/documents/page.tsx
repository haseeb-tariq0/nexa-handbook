import Link from "next/link";
import { Plus, Pencil, ChevronRight, EyeOff, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { reads } from "@/lib/supabase/reads";
import {
  DOC_CATEGORY_LABELS,
  FILE_TYPE_LABELS,
} from "@/lib/queries/documents";
import { deleteDocument } from "@/app/(app)/admin/documents/actions";

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function listAllDocuments() {
  const supabase = await reads();
  const { data } = await supabase
    .from("documents")
    .select(
      "id, title, category, file_type, external_url, is_published, updated_at, owner:owner_id(full_name)",
    )
    .order("updated_at", { ascending: false });
  return (data ?? []) as Array<{
    id: string;
    title: string;
    category: string;
    file_type: string | null;
    external_url: string;
    is_published: boolean;
    updated_at: string;
    owner: { full_name: string } | null;
  }>;
}

export default async function AdminDocumentsPage() {
  const docs = await listAllDocuments();

  return (
    <>
      <PageHeader
        title="Documents"
        description="Brand, templates, policies, onboarding packs — indexed and linked."
        actions={
          <Link href="/admin/documents/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New document
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Documents
      </div>

      {docs.length === 0 ? (
        <EmptyState title="No documents yet" description="Add the first one." />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_120px_120px_110px_120px] gap-4 px-5 py-3 bg-panel-2 border-b border-border text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
            <div>Title</div>
            <div>Category</div>
            <div>Type</div>
            <div>Owner</div>
            <div className="text-right">Updated</div>
            <div className="text-right">Actions</div>
          </div>
          {docs.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-[1fr_120px_120px_120px_110px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-text-1 truncate">
                    {d.title}
                  </span>
                  {!d.is_published && (
                    <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-text-3 bg-panel-2 border border-border px-1.5 py-0.5 rounded">
                      <EyeOff className="h-2.5 w-2.5" />
                      Draft
                    </span>
                  )}
                </div>
                <a
                  href={d.external_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10.5px] text-text-4 hover:text-nexa-purple transition truncate max-w-full"
                >
                  <span className="truncate">{d.external_url}</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                </a>
              </div>
              <div>
                <Badge variant="indigo">
                  {DOC_CATEGORY_LABELS[d.category] ?? d.category}
                </Badge>
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {d.file_type ? FILE_TYPE_LABELS[d.file_type] ?? d.file_type : "—"}
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {d.owner?.full_name ?? <span className="text-text-4">—</span>}
              </div>
              <div className="text-[11.5px] text-text-3 text-right">
                {formatDate(d.updated_at)}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/documents/${d.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={d.title}
                  onDelete={async () => {
                    "use server";
                    return deleteDocument(d.id);
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
