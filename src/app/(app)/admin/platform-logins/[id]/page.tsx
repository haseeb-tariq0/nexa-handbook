import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlatformLoginForm } from "@/components/admin/PlatformLoginForm";
import { reads } from "@/lib/supabase/reads";
import { listActiveTeam } from "@/lib/queries/team";
import { updatePlatformLogin } from "@/app/(app)/admin/platform-logins/actions";

export const revalidate = 0;

async function getTool(id: string) {
  const supabase = await reads();
  const { data } = await supabase
    .from("platform_logins")
    .select(
      "id, tool_name, tool_url, description, category, login_identifier, credential_value, price, valid_until, access_notes, managed_by_id",
    )
    .eq("id", id)
    .single();
  return data as {
    id: string;
    tool_name: string;
    tool_url: string | null;
    description: string | null;
    category:
      | "design"
      | "production"
      | "web"
      | "sales_am"
      | "seo"
      | "content"
      | "performance"
      | "social"
      | "everyone"
      | "ai_labs";
    login_identifier: string | null;
    credential_value: string | null;
    price: string | null;
    valid_until: string | null;
    access_notes: string | null;
    managed_by_id: string | null;
  } | null;
}

export default async function EditPlatformLoginPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [tool, team] = await Promise.all([getTool(id), listActiveTeam()]);
  if (!tool) notFound();

  return (
    <>
      <PageHeader title={`Edit · ${tool.tool_name}`} />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/platform-logins" className="hover:text-text-1 transition">
          Platform logins
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        Edit
      </div>
      <PlatformLoginForm
        initial={tool}
        ownerOptions={team.map((m) => ({ id: m.id, label: m.full_name }))}
        onSubmit={async (fd) => {
          "use server";
          return updatePlatformLogin(tool.id, fd);
        }}
        submitLabel="Save changes"
      />
    </>
  );
}
