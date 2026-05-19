import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SopFilters } from "@/components/sops/SopFilters";
import { listPublishedSops } from "@/lib/queries/sops";
import { listDepartments } from "@/lib/queries/departments";
import { isAdmin } from "@/lib/auth/is-admin";

export const revalidate = 60;

export default async function SopsPage() {
  const [sops, departments, admin] = await Promise.all([
    listPublishedSops(),
    listDepartments(),
    isAdmin(),
  ]);

  return (
    <>
      <PageHeader
        title="Standard Operating Procedures"
        description="All NEXA procedures in one place. Filter by department or search by name."
        actions={
          admin ? (
            <Link href="/admin/sops/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                Add an SOP
              </Button>
            </Link>
          ) : undefined
        }
      />

      {sops.length === 0 ? (
        <EmptyState
          title="No SOPs published yet"
          description="The Operations Manager hasn't published any SOPs."
        />
      ) : (
        <SopFilters
          sops={sops}
          departments={departments.map((d) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
          }))}
          isAdmin={admin}
        />
      )}
    </>
  );
}
