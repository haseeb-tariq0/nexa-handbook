import Link from "next/link";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listCommsStandards } from "@/lib/queries/comms";
import { deleteCommsStandard } from "@/app/(app)/admin/comms-standards/actions";

export const revalidate = 0;

const KIND_LABEL: Record<string, string> = {
  channel: "Channel",
  response_standard: "Response",
  meeting_do: "Do",
  meeting_dont: "Don't",
  meeting_decision: "Decision",
  escalation_path: "Escalation",
};

export default async function AdminCommsStandardsPage() {
  const items = await listCommsStandards();

  // Group by kind for clarity
  const groups = new Map<string, typeof items>();
  for (const it of items) {
    if (!groups.has(it.kind)) groups.set(it.kind, []);
    groups.get(it.kind)!.push(it);
  }

  return (
    <>
      <PageHeader
        title="Comms standards"
        description="Channel guide, response times, meeting rules, escalation paths."
        actions={
          <Link href="/admin/comms-standards/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New entry
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Comms standards
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No standards yet"
          description="Add channels, response times, meeting rules, escalation paths."
        />
      ) : (
        <div className="space-y-6">
          {Array.from(groups.entries()).map(([kind, list]) => (
            <section key={kind}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-text-3">
                  {KIND_LABEL[kind] ?? kind}
                </h2>
                <span className="text-[10.5px] text-text-4">{list.length}</span>
              </div>
              <div className="bg-panel border border-border rounded-md overflow-hidden">
                {list.map((it) => (
                  <div
                    key={it.id}
                    className="grid grid-cols-[1fr_80px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-text-1 truncate">
                        {it.title}
                      </div>
                      {it.body && (
                        <div className="text-[11px] text-text-3 truncate mt-0.5">
                          {it.body}
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-text-3 text-right">
                      {it.sort_order}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/comms-standards/${it.id}`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </Link>
                      <DeleteButton
                        itemLabel={it.title}
                        onDelete={async () => {
                          "use server";
                          return deleteCommsStandard(it.id);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
