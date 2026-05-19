"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Check, ArrowRight, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";
import { toggleOnboardingStep } from "@/app/(app)/onboarding/actions";
import type { OnboardingStepItem } from "@/lib/queries/onboarding";

// Map step.linked_section → app route. Same mapping the SPEC suggests.
const SECTION_HREF: Record<string, string> = {
  sops: "/sops",
  team: "/team",
  documents: "/documents",
  "platform-logins": "/platform-logins",
  "internal-comms": "/internal-comms",
  "nexa-tools": "/nexa-tools",
  profile: "/profile",
  departments: "/departments",
  onboarding: "/onboarding",
};

export function Checklist({
  steps,
  initialCompletedIds,
  devMode,
}: {
  steps: OnboardingStepItem[];
  initialCompletedIds: string[];
  devMode: boolean;
}) {
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(initialCompletedIds),
  );
  const [pending, startTransition] = useTransition();

  const groups = useMemo(() => {
    const map = new Map<string, OnboardingStepItem[]>();
    for (const s of steps) {
      if (!map.has(s.day_label)) map.set(s.day_label, []);
      map.get(s.day_label)!.push(s);
    }
    return Array.from(map.entries());
  }, [steps]);

  const total = steps.length;
  const done = completed.size;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  function toggle(stepId: string) {
    const wasDone = completed.has(stepId);
    setCompleted((prev) => {
      const next = new Set(prev);
      if (wasDone) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
    startTransition(async () => {
      const result = await toggleOnboardingStep(stepId, !wasDone);
      if (!result.ok) {
        // revert on error
        setCompleted((prev) => {
          const next = new Set(prev);
          if (wasDone) next.add(stepId);
          else next.delete(stepId);
          return next;
        });
      }
    });
  }

  return (
    <>
      {/* Progress header */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-text-1">
                Your first-week checklist
              </h2>
              <p className="text-[12px] text-text-3 mt-0.5">
                Work through these in order. Tick each one as you go.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[26px] font-semibold text-text-1 leading-none tracking-tight">
                {done}
                <span className="text-text-4 text-[16px] font-medium">
                  /{total}
                </span>
              </div>
              <div className="text-[10.5px] text-text-4 mt-1 uppercase tracking-wider">
                Complete
              </div>
            </div>
          </div>
          <div className="h-2 bg-panel-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-section-onboarding rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          {devMode && (
            <p className="mt-4 inline-flex items-start gap-1.5 text-[10.5px] text-text-3">
              <Info className="h-3 w-3 mt-0.5 shrink-0" />
              Dev mode — progress isn&rsquo;t saved (auth wired at end of build).
            </p>
          )}
        </CardBody>
      </Card>

      {/* Step groups */}
      <div className="space-y-6">
        {groups.map(([day, items]) => (
          <section key={day}>
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="text-[11px] font-semibold text-section-onboarding uppercase tracking-[0.16em]">
                {day}
              </h3>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10.5px] text-text-4">
                {items.filter((i) => completed.has(i.id)).length} / {items.length}
              </span>
            </div>
            <div className="space-y-2">
              {items.map((step) => {
                const isDone = completed.has(step.id);
                const href = step.external_url
                  ? step.external_url
                  : step.linked_section
                    ? SECTION_HREF[step.linked_section]
                    : null;
                const isExternal = step.external_url != null;

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "group flex items-start gap-3 p-4 bg-panel border rounded-md transition",
                      isDone
                        ? "border-section-onboarding/30 bg-status-green-bg/30"
                        : "border-border hover:border-border-3",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(step.id)}
                      disabled={pending}
                      aria-pressed={isDone}
                      className={cn(
                        "shrink-0 h-5 w-5 rounded-md border inline-flex items-center justify-center transition mt-0.5",
                        isDone
                          ? "bg-section-onboarding border-section-onboarding text-white"
                          : "bg-panel border-border-3 hover:border-section-onboarding",
                      )}
                    >
                      {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-[13px] font-semibold transition",
                          isDone ? "text-text-3 line-through" : "text-text-1",
                        )}
                      >
                        {step.title}
                      </div>
                      {step.description && (
                        <p className="text-[11.5px] text-text-3 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>

                    {href && (
                      <Link
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="shrink-0 self-start inline-flex items-center gap-1 text-[11px] font-medium text-text-3 hover:text-section-onboarding transition px-2 py-1 rounded hover:bg-status-green-bg"
                      >
                        Open
                        {isExternal ? (
                          <ExternalLink className="h-3 w-3" />
                        ) : (
                          <ArrowRight className="h-3 w-3" />
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
