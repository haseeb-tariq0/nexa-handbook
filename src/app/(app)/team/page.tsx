import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TeamViews } from "@/components/team/TeamViews";
import { listActiveTeam } from "@/lib/queries/team";
import { isAdmin } from "@/lib/auth/is-admin";

export const revalidate = 60;

export default async function TeamPage() {
  const [team, admin] = await Promise.all([listActiveTeam(), isAdmin()]);

  return (
    <>
      <PageHeader
        title="Team Directory"
        description="All NEXA employees with department, role, and contact options. Managed by the Operations Manager."
        actions={
          admin ? (
            <Link href="/admin/team/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                Add a member
              </Button>
            </Link>
          ) : undefined
        }
      />

      {team.length === 0 ? (
        <EmptyState
          title="No team members yet"
          description="The Operations Manager hasn't added anyone to the directory."
        />
      ) : (
        <TeamViews team={team} isAdmin={admin} />
      )}
    </>
  );
}
