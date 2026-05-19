import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentList } from "@/components/documents/DocumentList";
import { listDocuments } from "@/lib/queries/documents";
import { isAdmin } from "@/lib/auth/is-admin";

export const revalidate = 60;

export default async function DocumentsPage() {
  const [docs, admin] = await Promise.all([listDocuments(), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Documents"
        description="Brand, templates, policies, onboarding packs — indexed and linked to source."
        actions={
          admin ? (
            <Link href="/admin/documents/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                Add a document
              </Button>
            </Link>
          ) : undefined
        }
      />

      {docs.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="The Operations Manager hasn't added any documents."
        />
      ) : (
        <DocumentList docs={docs} isAdmin={admin} />
      )}
    </>
  );
}
