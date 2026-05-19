import Link from "next/link";
import { Plus, Pencil, ChevronRight, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listOnboardingVideos } from "@/lib/queries/onboarding";
import { deleteOnboardingVideo } from "@/app/(app)/admin/onboarding-videos/actions";

export const revalidate = 0;

export default async function AdminOnboardingVideosPage() {
  const videos = await listOnboardingVideos({ includeInactive: true });

  return (
    <>
      <PageHeader
        title="Onboarding videos"
        description="Training videos shown on the Onboarding page. URLs only — videos live on YouTube / Vimeo / Loom."
        actions={
          <Link href="/admin/onboarding-videos/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New video
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Onboarding videos
      </div>

      {videos.length === 0 ? (
        <EmptyState
          title="No videos yet"
          description="Add the first training video by URL."
        />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          {videos.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-[60px_1fr_100px_100px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="text-[11px] text-text-4 font-mono">
                {v.sort_order}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-[13px] font-medium text-text-1 truncate">
                    {v.title}
                  </div>
                  {!v.is_active && (
                    <Badge variant="default">
                      <EyeOff className="h-2.5 w-2.5" />
                      Hidden
                    </Badge>
                  )}
                </div>
                {v.description && (
                  <div className="text-[11px] text-text-3 truncate mt-0.5">
                    {v.description}
                  </div>
                )}
                <a
                  href={v.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10.5px] text-nexa-purple-deep hover:underline truncate inline-block max-w-full"
                >
                  {v.video_url}
                </a>
              </div>
              <div className="text-[11px] text-text-3 font-mono tabular-nums">
                {v.duration_label ?? "—"}
              </div>
              <div>
                {v.is_active ? (
                  <Badge variant="green">Active</Badge>
                ) : (
                  <Badge variant="default">Hidden</Badge>
                )}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/onboarding-videos/${v.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={v.title}
                  onDelete={async () => {
                    "use server";
                    return deleteOnboardingVideo(v.id);
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
