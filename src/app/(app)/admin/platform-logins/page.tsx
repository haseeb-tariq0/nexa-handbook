import Link from "next/link";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  listPlatformLogins,
  CATEGORY_LABELS,
} from "@/lib/queries/platform-logins";
import { deletePlatformLogin } from "@/app/(app)/admin/platform-logins/actions";

export const revalidate = 0;

export default async function AdminPlatformLoginsPage() {
  const tools = await listPlatformLogins();

  return (
    <>
      <PageHeader
        title="Platform logins"
        description="Tools NEXA pays for, credentials, and access notes."
        actions={
          <Link href="/admin/platform-logins/new">
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
        Platform logins
      </div>

      {tools.length === 0 ? (
        <EmptyState
          title="No platform logins yet"
          description="Add the first tool — name, URL, credentials, who manages it."
          action={
            <Link href="/admin/platform-logins/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                New tool
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_120px_130px_120px] gap-4 px-5 py-3 bg-panel-2 border-b border-border text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
            <div>Tool</div>
            <div>Category</div>
            <div>Price</div>
            <div>Managed by</div>
            <div className="text-right">Actions</div>
          </div>
          {tools.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[1fr_140px_120px_130px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-text-1 truncate">
                  {t.tool_name}
                </div>
                <div className="text-[10.5px] text-text-3 truncate">
                  {t.login_identifier ?? "—"}
                </div>
              </div>
              <div>
                <Badge variant="coral">
                  {CATEGORY_LABELS[t.category] ?? t.category}
                </Badge>
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {t.price ?? <span className="text-text-4">—</span>}
              </div>
              <div className="text-[11.5px] text-text-2 truncate">
                {t.managed_by?.full_name ?? <span className="text-text-4">—</span>}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/platform-logins/${t.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={t.tool_name}
                  onDelete={async () => {
                    "use server";
                    return deletePlatformLogin(t.id);
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
