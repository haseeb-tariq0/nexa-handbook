import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OnboardingVideoForm } from "@/components/admin/OnboardingVideoForm";
import { createOnboardingVideo } from "@/app/(app)/admin/onboarding-videos/actions";

export default function NewOnboardingVideoPage() {
  return (
    <>
      <PageHeader title="New onboarding video" />
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
        New
      </div>
      <OnboardingVideoForm
        onSubmit={async (fd) => {
          "use server";
          return createOnboardingVideo(fd);
        }}
        submitLabel="Create video"
      />
    </>
  );
}
