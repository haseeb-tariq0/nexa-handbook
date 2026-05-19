import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TemplateForm } from "@/components/admin/TemplateForm";
import { listActiveTeam } from "@/lib/queries/team";
import { createMessageTemplate } from "@/app/(app)/admin/templates/actions";

export default async function NewTemplatePage() {
  const team = await listActiveTeam();
  return (
    <>
      <PageHeader title="New template" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/templates" className="hover:text-text-1 transition">
          Templates
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <TemplateForm
        ownerOptions={team.map((m) => ({ id: m.id, label: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return createMessageTemplate(fd);
        }}
        submitLabel="Create template"
      />
    </>
  );
}
