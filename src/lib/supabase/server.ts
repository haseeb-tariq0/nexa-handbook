import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: any }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — cookies are read-only there.
            // The middleware refreshes the session on every request, so this
            // path being a no-op is safe.
          }
        },
      },
    },
  );
}

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client. SERVER ONLY. Used by the auth callback to upsert
// profiles and apply ADMIN_EMAILS. Never expose this to the browser.
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase URL or service role key. Service-role calls must run on the server only.",
    );
  }
  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
