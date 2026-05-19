import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CommsStandardForm } from "@/components/admin/CommsStandardForm";
import { reads } from "@/lib/supabase/reads";
import { updateCommsStandard } from "@/app/(app)/admin/comms-standards/actions";

export const revalidate = 0;

async function getStandard(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("comms_standards")
    .select("id, kind, title, body, meta, sort_order")
    .eq("id", id)
    .single();
  return data as {
    id: string;
    kind:
      | "channel"
      | "response_standard"
      | "meeting_do"
      | "meeting_dont"
      | "meeting_decision"
      | "escalation_path";
    title: string;
    body: string | null;
    meta: Record<string, unknown>;
    sort_order: number;
  } | null;
}

export default async function EditCommsStandardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getStandard(id);
  if (!item) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${item.title}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/comms-standards" className="hover:text-text-1 transition">
          Comms standards
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <CommsStandardForm
        initial={item}
        onSubmit={async (fd) => {
          "use server";
          return updateCommsStandard(item.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
