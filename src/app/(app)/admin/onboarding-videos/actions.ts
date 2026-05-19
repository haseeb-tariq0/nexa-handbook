"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { onboardingVideoSchema } from "@/lib/zod/onboarding-videos";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function parse(fd: FormData) {
  const desc = fd.get("description");
  const thumb = fd.get("thumbnail_url");
  const dur = fd.get("duration_label");
  return {
    title: String(fd.get("title") ?? ""),
    description: desc ? String(desc) : null,
    video_url: String(fd.get("video_url") ?? ""),
    thumbnail_url: thumb && thumb !== "" ? String(thumb) : null,
    duration_label: dur && dur !== "" ? String(dur) : null,
    sort_order: Number(fd.get("sort_order") ?? 0),
    is_active: fd.get("is_active") === "on" || fd.get("is_active") === "true",
  };
}

export async function createOnboardingVideo(fd: FormData): Promise<ActionResult> {
  const parsed = onboardingVideoSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await ((db() as any).from("onboarding_videos")).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/onboarding-videos");
  revalidatePath("/onboarding");
  redirect("/admin/onboarding-videos");
  return { ok: true };
}

export async function updateOnboardingVideo(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = onboardingVideoSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await ((db() as any).from("onboarding_videos"))
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/onboarding-videos");
  revalidatePath("/onboarding");
  return { ok: true };
}

export async function deleteOnboardingVideo(id: string): Promise<ActionResult> {
  const { error } = await ((db() as any).from("onboarding_videos"))
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/onboarding-videos");
  revalidatePath("/onboarding");
  return { ok: true };
}
