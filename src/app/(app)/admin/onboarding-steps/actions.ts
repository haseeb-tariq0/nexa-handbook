"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { onboardingStepSchema } from "@/lib/zod/onboarding-steps";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function parse(fd: FormData) {
  const desc = fd.get("description");
  const linked = fd.get("linked_section");
  const ext = fd.get("external_url");
  return {
    title: String(fd.get("title") ?? ""),
    description: desc ? String(desc) : null,
    day_label: String(fd.get("day_label") ?? ""),
    linked_section: linked && linked !== "" ? String(linked) : null,
    external_url: ext && ext !== "" ? String(ext) : null,
    sort_order: Number(fd.get("sort_order") ?? 0),
  };
}

export async function createOnboardingStep(fd: FormData): Promise<ActionResult> {
  const parsed = onboardingStepSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("onboarding_steps") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/onboarding-steps");
  revalidatePath("/onboarding");
  redirect("/admin/onboarding-steps");
  return { ok: true };
}

export async function updateOnboardingStep(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = onboardingStepSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("onboarding_steps") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/onboarding-steps");
  revalidatePath("/onboarding");
  return { ok: true };
}

export async function deleteOnboardingStep(id: string): Promise<ActionResult> {
  const { error } = await (db().from("onboarding_steps") as any)
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/onboarding-steps");
  revalidatePath("/onboarding");
  return { ok: true };
}
