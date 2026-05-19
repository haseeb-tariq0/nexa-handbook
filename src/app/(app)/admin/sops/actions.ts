"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sopSchema } from "@/lib/zod/sops";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function parse(fd: FormData) {
  const summary = fd.get("summary");
  const body = fd.get("body");
  const dept = fd.get("department_id");
  const owner = fd.get("owner_id");
  const ext = fd.get("external_link");
  const reviewed = fd.get("last_reviewed_at");
  return {
    title: String(fd.get("title") ?? ""),
    slug: String(fd.get("slug") ?? ""),
    summary: summary ? String(summary) : null,
    body: body ? String(body) : null,
    department_id: dept && dept !== "" ? String(dept) : null,
    owner_id: owner && owner !== "" ? String(owner) : null,
    external_link: ext && ext !== "" ? String(ext) : null,
    last_reviewed_at:
      reviewed && reviewed !== "" ? String(reviewed) : null,
    is_published: fd.get("is_published") === "true",
  };
}

export async function createSop(fd: FormData): Promise<ActionResult> {
  const parsed = sopSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("sops") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/sops");
  revalidatePath("/sops");
  revalidatePath("/");
  redirect("/admin/sops");
  return { ok: true };
}

export async function updateSop(id: string, fd: FormData): Promise<ActionResult> {
  const parsed = sopSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("sops") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/sops");
  revalidatePath(`/sops/${parsed.data.slug}`);
  revalidatePath("/sops");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSop(id: string): Promise<ActionResult> {
  const { error } = await (db().from("sops") as any).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/sops");
  revalidatePath("/sops");
  revalidatePath("/");
  return { ok: true };
}
