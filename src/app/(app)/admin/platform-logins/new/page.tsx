import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlatformLoginForm } from "@/components/admin/PlatformLoginForm";
import { listActiveTeam } from "@/lib/queries/team";
import { createPlatformLogin } from "@/app/(app)/admin/platform-logins/actions";

export default async function NewPlatformLoginPage() {
  const team = await listActiveTeam();
  return (
    <>
      <PageHeader title="New platform login" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/platform-logins" className="hover:text-text-1 transition">
          Platform logins
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <PlatformLoginForm
        ownerOptions={team.map((m) => ({ id: m.id, label: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return createPlatformLogin(fd);
        }}
        submitLabel="Add tool"
      />
    </>
  );
}
