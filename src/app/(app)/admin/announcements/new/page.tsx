import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { listActiveTeam } from "@/lib/queries/team";
import { createAnnouncement } from "@/app/(app)/admin/announcements/actions";

export const revalidate = 0;

export default async function NewAnnouncementPage() {
  const team = await listActiveTeam();
  return (
    <>
      <PageHeader title="New announcement" description="Post to the home ticker." />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/announcements" className="hover:text-text-1 transition">
          Announcements
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <AnnouncementForm
        authorOptions={team.map((m) => ({ id: m.id, full_name: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return createAnnouncement(fd);
        }}
        submitLabel="Publish"
      />
    </>
  );
}
