"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { commsStandardSchema } from "@/lib/zod/comms-standards";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function s(v: FormDataEntryValue | null) {
  return v && String(v) !== "" ? String(v) : null;
}

function parse(fd: FormData) {
  let meta: Record<string, unknown> = {};
  const rawMeta = fd.get("meta");
  if (rawMeta) {
    try {
      meta = JSON.parse(String(rawMeta));
    } catch {
      meta = {};
    }
  }
  return {
    kind: String(fd.get("kind") ?? "channel") as
      | "channel"
      | "response_standard"
      | "meeting_do"
      | "meeting_dont"
      | "meeting_decision"
      | "escalation_path",
    title: String(fd.get("title") ?? ""),
    body: s(fd.get("body")),
    meta,
    sort_order: Number(fd.get("sort_order") ?? 0),
  };
}

export async function createCommsStandard(fd: FormData): Promise<ActionResult> {
  const parsed = commsStandardSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("comms_standards") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/comms-standards");
  revalidatePath("/internal-comms");
  redirect("/admin/comms-standards");
  return { ok: true };
}

export async function updateCommsStandard(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = commsStandardSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("comms_standards") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/comms-standards");
  revalidatePath("/internal-comms");
  return { ok: true };
}

export async function deleteCommsStandard(id: string): Promise<ActionResult> {
  const { error } = await (db().from("comms_standards") as any)
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/comms-standards");
  revalidatePath("/internal-comms");
  return { ok: true };
}
