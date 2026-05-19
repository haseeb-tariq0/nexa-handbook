import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { InternalToolForm } from "@/components/admin/InternalToolForm";
import { createInternalTool } from "@/app/(app)/admin/internal-tools/actions";

export default function NewInternalToolPage() {
  return (
    <>
      <PageHeader title="New NEXA tool" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">
          Admin
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/internal-tools" className="hover:text-text-1 transition">
          NEXA tools
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <InternalToolForm
        onSubmit={async (fd) => {
          "use server";
          return createInternalTool(fd);
        }}
        submitLabel="Create tool"
      />
    </>
  );
}
