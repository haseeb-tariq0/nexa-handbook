"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { documentSchema } from "@/lib/zod/documents";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function s(v: FormDataEntryValue | null) {
  return v && String(v) !== "" ? String(v) : null;
}

function parse(fd: FormData) {
  return {
    title: String(fd.get("title") ?? ""),
    description: s(fd.get("description")),
    category: String(fd.get("category") ?? "brand") as
      | "brand"
      | "templates"
      | "policies"
      | "onboarding"
      | "hr"
      | "finance"
      | "operations"
      | "creative"
      | "ai_tech",
    external_url: String(fd.get("external_url") ?? ""),
    file_type: s(fd.get("file_type")) as
      | null
      | "pdf"
      | "docx"
      | "pptx"
      | "gdoc"
      | "gsheet"
      | "link"
      | "video",
    owner_id: s(fd.get("owner_id")),
    is_published: fd.get("is_published") === "true",
  };
}

export async function createDocument(fd: FormData): Promise<ActionResult> {
  const parsed = documentSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("documents") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  redirect("/admin/documents");
  return { ok: true };
}

export async function updateDocument(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = documentSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("documents") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  return { ok: true };
}

export async function deleteDocument(id: string): Promise<ActionResult> {
  const { error } = await (db().from("documents") as any).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/documents");
  revalidatePath("/documents");
  return { ok: true };
}
