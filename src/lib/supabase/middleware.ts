import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";
import { isDevBypassEnabled } from "@/lib/auth/dev-bypass";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/auth/error"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function updateSession(request: NextRequest) {
  // Dev-only bypass — skips auth gating entirely. See [[auth-deferred-to-end]].
  if (isDevBypassEnabled()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: any }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: do not put any logic between client creation and getUser().
  // It refreshes the session cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Unauthenticated → /login (unless already on a public route)
  if (!user && !isPublic(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in but visiting /login → bounce to home
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Admin gate — return 404 (not 403) so non-admins don't know /admin exists.
  // SPEC §7.
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!(profile as { is_admin?: boolean } | null)?.is_admin) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return supabaseResponse;
}
