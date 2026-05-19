import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isDevBypassEnabled } from "@/lib/auth/dev-bypass";

// Returns a Supabase client suitable for server-side reads.
// In normal mode: authenticated session client (RLS applies).
// In dev-bypass mode: service-role client so we can preview pages
// without a real session. See [[auth-deferred-to-end]].
//
// Returns `any` deliberately: the generated Database type's deep generics
// don't infer through Supabase's `.from()` overloads in this version, so we
// type queries at the function-return level instead of the client level.
// See src/lib/queries/* for the pattern.
export async function reads(): Promise<any> {
  if (isDevBypassEnabled()) {
    return createServiceRoleClient();
  }
  return createClient();
}
