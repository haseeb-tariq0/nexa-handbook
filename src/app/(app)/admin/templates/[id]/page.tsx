import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TemplateForm } from "@/components/admin/TemplateForm";
import { reads } from "@/lib/supabase/reads";
import { listActiveTeam } from "@/lib/queries/team";
import { updateMessageTemplate } from "@/app/(app)/admin/templates/actions";

export const revalidate = 0;

async function getTemplate(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("message_templates")
    .select("id, title, description, body, category, owner_id")
    .eq("id", id)
    .single();
  return data as {
    id: string;
    title: string;
    description: string | null;
    body: string;
    category:
      | "client_facing"
      | "internal"
      | "announcement"
      | "hr"
      | "meeting"
      | "escalation";
    owner_id: string | null;
  } | null;
}

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tpl, team] = await Promise.all([getTemplate(id), listActiveTeam()]);
  if (!tpl) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${tpl.title}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/templates" className="hover:text-text-1 transition">
          Templates
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <TemplateForm
        initial={tpl}
        ownerOptions={team.map((m) => ({ id: m.id, label: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return updateMessageTemplate(tpl.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
