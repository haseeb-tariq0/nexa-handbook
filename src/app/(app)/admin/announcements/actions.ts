"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { announcementSchema } from "@/lib/zod/announcements";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

function db() {
  return createServiceRoleClient();
}

function parse(fd: FormData) {
  return {
    title: String(fd.get("title") ?? ""),
    body: String(fd.get("body") ?? ""),
    category: String(fd.get("category") ?? "ops") as
      | "new"
      | "reminder"
      | "access"
      | "ops"
      | "tools"
      | "team",
    posted_by_id:
      fd.get("posted_by_id") && fd.get("posted_by_id") !== ""
        ? String(fd.get("posted_by_id"))
        : null,
    is_pinned: fd.get("is_pinned") === "true",
  };
}

export async function createAnnouncement(fd: FormData): Promise<ActionResult> {
  const parsed = announcementSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await (db().from("announcements") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/announcements");
  revalidatePath("/internal-comms");
  revalidatePath("/");
  redirect("/admin/announcements");
  return { ok: true };
}

export async function updateAnnouncement(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = announcementSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { error } = await (db().from("announcements") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/announcements");
  revalidatePath("/internal-comms");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  const { error } = await (db().from("announcements") as any)
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/announcements");
  revalidatePath("/internal-comms");
  revalidatePath("/");
  return { ok: true };
}
