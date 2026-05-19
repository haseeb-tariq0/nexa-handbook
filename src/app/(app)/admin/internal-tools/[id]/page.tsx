import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { InternalToolForm } from "@/components/admin/InternalToolForm";
import { reads } from "@/lib/supabase/reads";
import { updateInternalTool } from "@/app/(app)/admin/internal-tools/actions";

export const revalidate = 0;

async function getTool(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("internal_tools")
    .select(
      "id, name, url, description, icon_emoji, accent_color, is_live, sort_order",
    )
    .eq("id", id)
    .single();
  return data as {
    id: string;
    name: string;
    url: string;
    description: string | null;
    icon_emoji: string | null;
    accent_color: string | null;
    is_live: boolean;
    sort_order: number;
  } | null;
}

export default async function EditInternalToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = await getTool(id);
  if (!tool) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${tool.name}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/internal-tools" className="hover:text-text-1 transition">
          NEXA tools
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <InternalToolForm
        initial={tool}
        onSubmit={async (fd) => {
          "use server";
          return updateInternalTool(tool.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
