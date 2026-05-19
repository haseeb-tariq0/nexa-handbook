"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { platformLoginSchema } from "@/lib/zod/platform-logins";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function s(v: FormDataEntryValue | null) {
  return v && String(v) !== "" ? String(v) : null;
}

function parse(fd: FormData) {
  return {
    tool_name: String(fd.get("tool_name") ?? ""),
    tool_url: s(fd.get("tool_url")),
    description: s(fd.get("description")),
    category: String(fd.get("category") ?? "everyone") as
      | "design"
      | "production"
      | "web"
      | "sales_am"
      | "seo"
      | "content"
      | "performance"
      | "social"
      | "everyone"
      | "ai_labs",
    login_identifier: s(fd.get("login_identifier")),
    credential_value: s(fd.get("credential_value")),
    price: s(fd.get("price")),
    valid_until: s(fd.get("valid_until")),
    access_notes: s(fd.get("access_notes")),
    managed_by_id: s(fd.get("managed_by_id")),
  };
}

export async function createPlatformLogin(fd: FormData): Promise<ActionResult> {
  const parsed = platformLoginSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("platform_logins") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/platform-logins");
  revalidatePath("/platform-logins");
  redirect("/admin/platform-logins");
  return { ok: true };
}

export async function updatePlatformLogin(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = platformLoginSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("platform_logins") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/platform-logins");
  revalidatePath("/platform-logins");
  return { ok: true };
}

export async function deletePlatformLogin(id: string): Promise<ActionResult> {
  const { error } = await (db().from("platform_logins") as any)
    .delete()
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/platform-logins");
  revalidatePath("/platform-logins");
  return { ok: true };
}
