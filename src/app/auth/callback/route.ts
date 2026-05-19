import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const WORKSPACE_DOMAIN =
  process.env.GOOGLE_WORKSPACE_DOMAIN?.toLowerCase() ?? "digitalnexa.com";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?reason=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/auth/error?reason=exchange_failed`);
  }

  const email = data.user.email?.toLowerCase();

  if (!email || !email.endsWith(`@${WORKSPACE_DOMAIN}`)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/auth/error?reason=domain`);
  }

  const service = createServiceRoleClient();

  // Check if this user already has a profile. If so, leave is_admin alone —
  // it's managed via the /admin/users UI after first sign-in.
  const { data: existing } = await (service.from("profiles") as any)
    .select("id, is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  if (existing) {
    await (service.from("profiles") as any)
      .update({
        email,
        full_name:
          (data.user.user_metadata?.full_name as string | undefined) ?? null,
        avatar_url:
          (data.user.user_metadata?.avatar_url as string | undefined) ?? null,
      })
      .eq("id", data.user.id);
  } else {
    // First sign-in. intended_admin (if explicitly set) overrides ADMIN_EMAILS.
    //   null/missing → fall back to ADMIN_EMAILS membership
    //   true         → admin
    //   false        → member (even if ADMIN_EMAILS lists this email)
    const { data: tm } = await (service.from("team_members") as any)
      .select("intended_admin")
      .eq("email", email)
      .maybeSingle();
    const intended = (tm as { intended_admin?: boolean | null } | null)
      ?.intended_admin;
    const isAdmin =
      intended === null || intended === undefined
        ? ADMIN_EMAILS.includes(email)
        : intended;

    await (service.from("profiles") as any).insert({
      id: data.user.id,
      email,
      full_name:
        (data.user.user_metadata?.full_name as string | undefined) ?? null,
      avatar_url:
        (data.user.user_metadata?.avatar_url as string | undefined) ?? null,
      is_admin: isAdmin,
    });
  }

  const safeNext = next.startsWith("/") ? next : "/";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
