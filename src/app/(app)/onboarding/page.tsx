import Link from "next/link";
import { Settings2, Video } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Checklist } from "@/components/onboarding/Checklist";
import { VideoStrip } from "@/components/onboarding/VideoStrip";
import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled } from "@/lib/auth/dev-bypass";
import { isAdmin } from "@/lib/auth/is-admin";
import {
  listOnboardingSteps,
  listCompletedStepIds,
  listOnboardingVideos,
} from "@/lib/queries/onboarding";

export const revalidate = 0;

export default async function OnboardingPage() {
  const [steps, videos, admin] = await Promise.all([
    listOnboardingSteps(),
    listOnboardingVideos(),
    isAdmin(),
  ]);

  let completed: string[] = [];
  if (!isDevBypassEnabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      completed = await listCompletedStepIds(user.id);
    }
  }

  return (
    <>
      <PageHeader
        title="Onboarding"
        description="Your first-week guide at NEXA — tick each step as you go."
        actions={
          admin ? (
            <>
              <Link href="/admin/onboarding-videos">
                <Button variant="secondary">
                  <Video className="h-3 w-3" />
                  Manage videos
                </Button>
              </Link>
              <Link href="/admin/onboarding-steps">
                <Button variant="secondary">
                  <Settings2 className="h-3 w-3" />
                  Manage steps
                </Button>
              </Link>
            </>
          ) : undefined
        }
      />

      {steps.length === 0 ? (
        <EmptyState
          title="No onboarding steps yet"
          description="The Operations Manager hasn't published the onboarding checklist."
        />
      ) : (
        <Checklist
          steps={steps}
          initialCompletedIds={completed}
          devMode={isDevBypassEnabled()}
        />
      )}

      <VideoStrip videos={videos} />
    </>
  );
}
