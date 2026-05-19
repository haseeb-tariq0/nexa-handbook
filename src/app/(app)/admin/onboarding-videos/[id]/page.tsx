import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OnboardingVideoForm } from "@/components/admin/OnboardingVideoForm";
import { getOnboardingVideo } from "@/lib/queries/onboarding";
import { updateOnboardingVideo } from "@/app/(app)/admin/onboarding-videos/actions";

export const revalidate = 0;

export default async function EditOnboardingVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getOnboardingVideo(id);
  if (!video) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${video.title}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link
          href="/admin/onboarding-videos"
          className="hover:text-text-1 transition"
        >
          Onboarding videos
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <OnboardingVideoForm
        initial={video}
        onSubmit={async (fd) => {
          "use server";
          return updateOnboardingVideo(video.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
