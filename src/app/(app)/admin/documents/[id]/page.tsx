import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DocumentForm } from "@/components/admin/DocumentForm";
import { reads } from "@/lib/supabase/reads";
import { listActiveTeam } from "@/lib/queries/team";
import { updateDocument } from "@/app/(app)/admin/documents/actions";

export const revalidate = 0;

async function getDoc(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("documents")
    .select(
      "id, title, description, category, external_url, file_type, owner_id, is_published",
    )
    .eq("id", id)
    .single();
  return data as {
    id: string;
    title: string;
    description: string | null;
    category:
      | "brand"
      | "templates"
      | "policies"
      | "onboarding"
      | "hr"
      | "finance"
      | "operations"
      | "creative"
      | "ai_tech";
    external_url: string;
    file_type: string | null;
    owner_id: string | null;
    is_published: boolean;
  } | null;
}

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [doc, team] = await Promise.all([getDoc(id), listActiveTeam()]);
  if (!doc) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${doc.title}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/documents" className="hover:text-text-1 transition">
          Documents
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <DocumentForm
        initial={doc}
        ownerOptions={team.map((m) => ({ id: m.id, label: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return updateDocument(doc.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
