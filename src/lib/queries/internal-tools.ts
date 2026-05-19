import { reads } from "@/lib/supabase/reads";
import type { InternalTool } from "@/lib/db";

export type InternalToolListItem = InternalTool;

export async function listInternalTools(): Promise<InternalToolListItem[]> {
  const supabase = await reads();
  const { data, error } = await supabase
    .from("internal_tools")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`internal tools failed: ${error.message}`);
  return (data ?? []) as InternalToolListItem[];
}
