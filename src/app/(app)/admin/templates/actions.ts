"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { messageTemplateSchema } from "@/lib/zod/templates";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function s(v: FormDataEntryValue | null) {
  return v && String(v) !== "" ? String(v) : null;
}

function parse(fd: FormData) {
  return {
    title: String(fd.get("title") ?? ""),
    description: s(fd.get("description")),
    body: String(fd.get("body") ?? ""),
    category: String(fd.get("category") ?? "internal") as
      | "client_facing"
      | "internal"
      | "announcement"
      | "hr"
      | "meeting"
      | "escalation",
    owner_id: s(fd.get("owner_id")),
  };
}

export async function createMessageTemplate(fd: FormData): Promise<ActionResult> {
  const parsed = messageTemplateSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("message_templates") as any).insert(
    parsed.data,
  );
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/templates");
  revalidatePath("/internal-comms");
  redirect("/admin/templates");
  return { ok: true };
}

export async function updateMessageTemplate(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = messageTemplateSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("message_templates") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/templates");
  revalidatePath("/internal-comms");
  return { ok: true };
}

export async function deleteMessageTemplate(id: string): Promise<ActionResult> {
  const { error } = await (db().from("message_templates") as any)
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/templates");
  revalidatePath("/internal-comms");
  return { ok: true };
}
