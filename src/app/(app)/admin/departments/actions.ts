"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { departmentSchema } from "@/lib/zod/departments";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

function db() {
  // Admin writes always use the service-role client. RLS already enforces
  // is_admin = true; service-role bypasses RLS, but we've gated the /admin
  // routes at the middleware + layout level, so this is safe.
  return createServiceRoleClient();
}

export async function createDepartment(formData: FormData): Promise<ActionResult> {
  const raw = parseFormData(formData);
  const parsed = departmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const { data, error } = await (db().from("departments") as any)
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/departments");
  revalidatePath("/departments");
  revalidatePath("/");
  redirect(`/admin/departments`);
  // unreachable — but TS needs a return path
  return { ok: true, id: (data as { id: string }).id };
}

export async function updateDepartment(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const raw = parseFormData(formData);
  const parsed = departmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const { error } = await (db().from("departments") as any)
    .update(parsed.data)
    .eq("id", id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/departments");
  revalidatePath(`/departments/${parsed.data.slug}`);
  revalidatePath("/departments");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteDepartment(id: string): Promise<ActionResult> {
  const { error } = await (db().from("departments") as any).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/departments");
  revalidatePath("/departments");
  revalidatePath("/");
  return { ok: true };
}

function parseFormData(fd: FormData) {
  const lead_id = fd.get("lead_id");
  const description = fd.get("description");
  return {
    name: String(fd.get("name") ?? ""),
    slug: String(fd.get("slug") ?? ""),
    description: description ? String(description) : null,
    core_expertise: JSON.parse(String(fd.get("core_expertise") ?? "[]")),
    key_tools: JSON.parse(String(fd.get("key_tools") ?? "[]")),
    lead_id: lead_id && lead_id !== "" ? String(lead_id) : null,
    sort_order: Number(fd.get("sort_order") ?? 0),
  };
}
