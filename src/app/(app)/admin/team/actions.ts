"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { teamMemberSchema } from "@/lib/zod/team-members";

type ActionResult = { ok: true } | { ok: false; error: string };
const db = () => createServiceRoleClient();

function s(v: FormDataEntryValue | null) {
  return v && String(v) !== "" ? String(v) : null;
}

function parse(fd: FormData) {
  return {
    email: String(fd.get("email") ?? ""),
    full_name: String(fd.get("full_name") ?? ""),
    role_title: String(fd.get("role_title") ?? ""),
    department_id: s(fd.get("department_id")),
    slack_handle: s(fd.get("slack_handle")),
    phone: s(fd.get("phone")),
    whatsapp: s(fd.get("whatsapp")),
    working_hours: s(fd.get("working_hours")),
    location: s(fd.get("location")),
    reports_to: s(fd.get("reports_to")),
    bio: s(fd.get("bio")),
    avatar_url: s(fd.get("avatar_url")),
    is_active: fd.get("is_active") === "true",
    sort_order: Number(fd.get("sort_order") ?? 0),
  };
}

export async function createTeamMember(fd: FormData): Promise<ActionResult> {
  const parsed = teamMemberSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("team_members") as any).insert(parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/departments");
  revalidatePath("/");
  redirect("/admin/team");
  return { ok: true };
}

export async function updateTeamMember(
  id: string,
  fd: FormData,
): Promise<ActionResult> {
  const parsed = teamMemberSchema.safeParse(parse(fd));
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const { error } = await (db().from("team_members") as any)
    .update(parsed.data)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/team");
  revalidatePath(`/team/${id}`);
  revalidatePath("/team");
  revalidatePath("/departments");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const { error } = await (db().from("team_members") as any).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/departments");
  revalidatePath("/");
  return { ok: true };
}
