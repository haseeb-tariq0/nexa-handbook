import Link from "next/link";
import { Plus, Pencil, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listOnboardingSteps } from "@/lib/queries/onboarding";
import { deleteOnboardingStep } from "@/app/(app)/admin/onboarding-steps/actions";

export const revalidate = 0;

export default async function AdminOnboardingStepsPage() {
  const steps = await listOnboardingSteps();

  return (
    <>
      <PageHeader
        title="Onboarding steps"
        description="Day-1 to Day-5 checklist shown to every new starter."
        actions={
          <Link href="/admin/onboarding-steps/new">
            <Button variant="primary">
              <Plus className="h-3 w-3" />
              New step
            </Button>
          </Link>
        }
      />

      <div className="mb-3 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Onboarding steps
      </div>

      {steps.length === 0 ? (
        <EmptyState title="No onboarding steps" description="Add the first one." />
      ) : (
        <div className="bg-panel border border-border rounded-md overflow-hidden">
          {steps.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-[60px_100px_1fr_140px_120px] gap-4 px-5 py-3 items-center border-b border-border last:border-b-0 hover:bg-panel-2/50 transition"
            >
              <div className="text-[11px] text-text-4 font-mono">{s.sort_order}</div>
              <div>
                <Badge variant="green">{s.day_label}</Badge>
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-text-1 truncate">
                  {s.title}
                </div>
                {s.description && (
                  <div className="text-[11px] text-text-3 truncate mt-0.5">
                    {s.description}
                  </div>
                )}
              </div>
              <div className="text-[11px] text-text-3 truncate">
                {s.linked_section ? `/${s.linked_section}` : s.external_url ? "external" : "—"}
              </div>
              <div className="flex items-center justify-end gap-1">
                <Link href={`/admin/onboarding-steps/${s.id}`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </Link>
                <DeleteButton
                  itemLabel={s.title}
                  onDelete={async () => {
                    "use server";
                    return deleteOnboardingStep(s.id);
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
