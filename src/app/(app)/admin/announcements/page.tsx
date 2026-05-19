import Link from "next/link";
import { Plus, Pencil, ChevronRight, Pin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listRecentAnnouncements } from "@/lib/queries/announcements";
import { deleteAnnouncement } from "@/app/(app)/admin/announcements/actions";

export const revalidate = 0;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

export default async function AdminAnnouncementsPage() {
  const items = await listRecentAnnouncements(50);

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Posts shown in the home ticker and archived in Internal Comms."
        actions={
          <Link href="/admin/announcements/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New announcement
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>{" "}
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />{" "}
        Announcements
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Post the first one — it'll appear in the home ticker immediately."
          action={
            <Link href="/admin/announcements/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                New announcement
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          {items.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-[1fr_110px_90px_120px] gap-4 px-5 py-3 items-start border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[13px] font-medium text-text-1">
                    {a.title}
                  </span>
                  {a.is_pinned && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-status-amber">
                      <Pin className="h-2.5 w-2.5" />
                      Pinned
                    </span>
                  )}
                </div>
                <div className="text-[11.5px] text-text-3 mt-0.5 line-clamp-1">
                  {a.body}
                </div>
              </div>
              <div>
                <Badge variant="default">{a.category}</Badge>
              </div>
              <div className="text-[11px] text-text-3">
                {formatDate(a.published_at)}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/announcements/${a.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={a.title}
                  onDelete={async () => {
                    "use server";
                    return deleteAnnouncement(a.id);
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
