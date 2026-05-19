"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isDevBypassEnabled } from "@/lib/auth/dev-bypass";

// In dev bypass mode, persistence is fake (handled client-side).
// In production, this writes to onboarding_completions scoped to the current user via RLS.
export async function toggleOnboardingStep(stepId: string, completed: boolean) {
  if (isDevBypassEnabled()) {
    // Dev mode: no DB write. Client tracks state in component memory.
    return { ok: true, mode: "dev" as const };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  if (completed) {
    const { error } = await (supabase.from("onboarding_completions") as any).upsert(
      { user_id: user.id, step_id: stepId },
      { onConflict: "user_id,step_id" },
    );
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await (supabase.from("onboarding_completions") as any)
      .delete()
      .eq("user_id", user.id)
      .eq("step_id", stepId);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/onboarding");
  return { ok: true, mode: "prod" as const };
}
