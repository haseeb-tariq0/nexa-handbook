import Link from "next/link";
import { Plus, Pencil, ChevronRight, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { reads } from "@/lib/supabase/reads";
import { deleteSop } from "@/app/(app)/admin/sops/actions";

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function listAllSops() {
  const supabase = await reads();
  const { data } = await supabase
    .from("sops")
    .select(
      "id, title, slug, summary, is_published, updated_at, departments(name), owner:owner_id(full_name)",
    )
    .order("updated_at", { ascending: false });
  return (data ?? []) as Array<{
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    is_published: boolean;
    updated_at: string;
    departments: { name: string } | null;
    owner: { full_name: string } | null;
  }>;
}

export default async function AdminSopsPage() {
  const sops = await listAllSops();

  return (
    <>
      <PageHeader
        title="SOPs"
        description="Standard operating procedures. Drafts and published, by department."
        actions={
          <Link href="/admin/sops/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New SOP
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        SOPs
      </div>

      {sops.length === 0 ? (
        <EmptyState title="No SOPs yet" description="Create the first one." />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_160px_160px_110px_120px] gap-4 px-5 py-3 bg-panel-2 border-b border-border text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
            <div>Title</div>
            <div>Department</div>
            <div>Owner</div>
            <div className="text-right">Updated</div>
            <div className="text-right">Actions</div>
          </div>
          {sops.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[1fr_160px_160px_110px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-text-1 truncate">
                    {s.title}
                  </span>
                  {!s.is_published && (
                    <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-text-3 bg-panel-2 border border-border px-1.5 py-0.5 rounded">
                      <EyeOff className="h-2.5 w-2.5" />
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-[10.5px] text-text-4 font-mono truncate">
                  /{s.slug}
                </div>
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {s.departments?.name ?? <span className="text-text-4">—</span>}
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {s.owner?.full_name ?? <span className="text-text-4">—</span>}
              </div>
              <div className="text-[11.5px] text-text-3 text-right">
                {formatDate(s.updated_at)}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/sops/${s.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={s.title}
                  onDelete={async () => {
                    "use server";
                    return deleteSop(s.id);
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
