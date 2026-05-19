import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CommsStandardForm } from "@/components/admin/CommsStandardForm";
import { createCommsStandard } from "@/app/(app)/admin/comms-standards/actions";

export default function NewCommsStandardPage() {
  return (
    <>
      <PageHeader title="New comms standard" />
      <div className="mb-5 text-[11.5px] text-text-3">
        <Link href="/admin" className="hover:text-text-1 transition">Admin</Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        <Link href="/admin/comms-standards" className="hover:text-text-1 transition">
          Comms standards
        </Link>
        <ChevronRight className="inline h-2.5 w-2.5 mx-1 text-text-4" />
        New
      </div>
      <CommsStandardForm
        onSubmit={async (fd) => {
          "use server";
          return createCommsStandard(fd);
        }}
        submitLabel="Create entry"
      />
    </>
  );
}
