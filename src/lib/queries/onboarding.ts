import { reads } from "@/lib/supabase/reads";
import type { OnboardingStep } from "@/lib/db";

export type OnboardingStepItem = Pick<
  OnboardingStep,
  "id" | "title" | "description" | "day_label" | "linked_section" | "external_url" | "sort_order"
>;

export type OnboardingVideo = {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration_label: string | null;
  sort_order: number;
  is_active: boolean;
};

export async function listOnboardingSteps(): Promise<OnboardingStepItem[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("onboarding_steps")
    .select("id, title, description, day_label, linked_section, external_url, sort_order")
    .order("sort_order", { ascending: true });
  return (data ?? []) as OnboardingStepItem[];
}

export async function listCompletedStepIds(userId: string): Promise<string[]> {
  const supabase = await reads();
  const { data } = await supabase
    .from("onboarding_completions")
    .select("step_id")
    .eq("user_id", userId);
  return ((data ?? []) as { step_id: string }[]).map((r) => r.step_id);
}

export async function listOnboardingVideos(opts?: { includeInactive?: boolean }): Promise<OnboardingVideo[]> {
  const supabase = await reads();
  let query = ((supabase as any).from("onboarding_videos"))
    .select("id, title, description, video_url, thumbnail_url, duration_label, sort_order, is_active")
    .order("sort_order", { ascending: true });
  if (!opts?.includeInactive) {
    query = query.eq("is_active", true);
  }
  const { data } = await query;
  return (data ?? []) as OnboardingVideo[];
}

export async function getOnboardingVideo(id: string): Promise<OnboardingVideo | null> {
  const supabase = await reads();
  const { data } = await ((supabase as any).from("onboarding_videos"))
    .select("id, title, description, video_url, thumbnail_url, duration_label, sort_order, is_active")
    .eq("id", id)
    .maybeSingle();
  return (data ?? null) as OnboardingVideo | null;
}
