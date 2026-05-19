"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { internalToolSchema } from "@/lib/zod/internal-tools";

type ActionResult = { ok: true } | { ok: false; error: string };

const db = () => createServiceRoleClient();

function parse(fd: FormData) {
  const desc = fd.get("description");
  const emoji = fd.get("icon_emoji");
  const color = fd.get("accent_color");
  return {
    name: String(fd.get("name") ?? ""),
    url: String(fd.get("url") ?? ""),
    description: desc ? String(desc) : null,
    icon_emoji: emoji ? String(emoji) : null,
    accent_color: color ? String(color) : null,
    is_live: fd.get("is_live") === "true",
    sort_order: Number(fd.get("sort_order") ?? 0),
  };
}

export async function createInternalTool(fd: FormData): Promise<ActionResult> {
  const parsed = internalToolSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { error } = await (db().from("internal_tools") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/internal-tools");
  revalidatePath("/nexa-tools");
  redirect("/admin/internal-tools");
  return { ok: true };
}

export async function updateInternalTool(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = internalToolSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  const { error } = await (db().from("internal_tools") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/internal-tools");
  revalidatePath("/nexa-tools");
  return { ok: true };
}

export async function deleteInternalTool(id: string): Promise<ActionResult> {
  const { error } = await (db().from("internal_tools") as any).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/internal-tools");
  revalidatePath("/nexa-tools");
  return { ok: true };
}
