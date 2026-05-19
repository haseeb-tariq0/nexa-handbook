"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";

type Result = { ok: true } | { ok: false; error: string };

const db = () => createServiceRoleClient();

// Toggle admin on a user who has already signed in (profiles row exists).
export async function setUserAdmin(
  userId: string,
  isAdmin: boolean,
): Promise<Result> {
  const { error } = await (db().from("profiles") as any)
    .update({ is_admin: isAdmin })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true };
}

// Pre-set admin for a team_member who hasn't signed in yet.
// Takes effect on their first sign-in (auth callback reads this).
export async function setIntendedAdmin(
  teamMemberId: string,
  intended: boolean,
): Promise<Result> {
  const { error } = await (db().from("team_members") as any)
    .update({ intended_admin: intended })
    .eq("id", teamMemberId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return { ok: true };
}
