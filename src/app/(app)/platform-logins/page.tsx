import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlatformList } from "@/components/platform-logins/PlatformList";
import { listPlatformLogins } from "@/lib/queries/platform-logins";
import { isAdmin } from "@/lib/auth/is-admin";

export const revalidate = 60;

export default async function PlatformLoginsPage() {
  const [tools, admin] = await Promise.all([
    listPlatformLogins(),
    isAdmin(),
  ]);
  const departmentCount = new Set(tools.map((t) => t.category)).size;

  return (
    <>
      <PageHeader
        title="Platform Logins"
        description={
          tools.length > 0
            ? `${tools.length} tools across ${departmentCount} categories. Treat this page as confidential — do not share externally.`
            : "Every tool NEXA uses — credentials, access notes, and ownership."
        }
        actions={
          admin ? (
            <Link href="/admin/platform-logins/new">
              <Button variant="primary">
                <Plus className="h-3 w-3" />
                Add a tool
              </Button>
            </Link>
          ) : undefined
        }
      />

      {tools.length === 0 ? (
        <EmptyState
          title="No platform logins yet"
          description="The Operations Manager hasn't added any tools."
        />
      ) : (
        <PlatformList tools={tools} isAdmin={admin} />
      )}
    </>
  );
}
