import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OnboardingStepForm } from "@/components/admin/OnboardingStepForm";
import { createOnboardingStep } from "@/app/(app)/admin/onboarding-steps/actions";

export default function NewOnboardingStepPage() {
  return (
    <>
      <PageHeader title="New onboarding step" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/onboarding-steps" className="hover:text-text-1 transition">
          Onboarding steps
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <OnboardingStepForm
        onSubmit={async (fd) => {
          "use server";
          return createOnboardingStep(fd);
        }}
        submitLabel="Create step"
      />
    </>
  );
}
