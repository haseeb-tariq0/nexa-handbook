import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OnboardingStepForm } from "@/components/admin/OnboardingStepForm";
import { reads } from "@/lib/supabase/reads";
import { updateOnboardingStep } from "@/app/(app)/admin/onboarding-steps/actions";

export const revalidate = 0;

async function getStep(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("onboarding_steps")
    .select("id, title, description, day_label, linked_section, external_url, sort_order")
    .eq("id", id)
    .single();
  return data as {
    id: string;
    title: string;
    description: string | null;
    day_label: string;
    linked_section: string | null;
    external_url: string | null;
    sort_order: number;
  } | null;
}

export default async function EditOnboardingStepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const step = await getStep(id);
  if (!step) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${step.title}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/onboarding-steps" className="hover:text-text-1 transition">
          Onboarding steps
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <OnboardingStepForm
        initial={step}
        onSubmit={async (fd) => {
          "use server";
          return updateOnboardingStep(step.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
