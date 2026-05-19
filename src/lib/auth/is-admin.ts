import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled, STUB_PROFILE } from "@/lib/auth/dev-bypass";

// Server-side admin check. Use in Server Components / Server Actions to
// conditionally render admin affordances.
export async function isAdmin(): Promise<boolean> {
  if (isDevBypassEnabled()) return STUB_PROFILE.is_admin;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await (supabase.from("profiles") as any)
    .select("is_admin")
    .eq("id", user.id)
    .single();
  return (data as { is_admin?: boolean } | null)?.is_admin ?? false;
}
