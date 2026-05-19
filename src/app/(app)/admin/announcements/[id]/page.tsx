import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { reads } from "@/lib/supabase/reads";
import { listActiveTeam } from "@/lib/queries/team";
import { updateAnnouncement } from "@/app/(app)/admin/announcements/actions";

export const revalidate = 0;

async function getAnnouncement(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, category, posted_by_id, is_pinned")
    .eq("id", id)
    .single();
  return data as {
    id: string;
    title: string;
    body: string;
    category: "new" | "reminder" | "access" | "ops" | "tools" | "team";
    posted_by_id: string | null;
    is_pinned: boolean;
  } | null;
}

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [a, team] = await Promise.all([getAnnouncement(id), listActiveTeam()]);
  if (!a) notFound();

  return (
    <>
      <PageHeader title="Edit announcement" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/announcements" className="hover:text-text-1 transition">
          Announcements
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <AnnouncementForm
        initial={a}
        authorOptions={team.map((m) => ({ id: m.id, full_name: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return updateAnnouncement(a.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
