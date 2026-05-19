"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Increment usage_count via the SECURITY DEFINER RPC. We use service-role
// because in dev there's no authenticated session; in prod, the RPC is
// gated to `authenticated` role anyway, so this is safe to call server-side.
export async function incrementTemplateUsage(templateId: string) {
  const supabase = createServiceRoleClient();
  await supabase.rpc("increment_template_usage", { template_id: templateId });
  revalidatePath("/internal-comms");
}
