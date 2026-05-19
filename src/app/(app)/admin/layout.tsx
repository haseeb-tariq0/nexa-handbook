import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isDevBypassEnabled, STUB_PROFILE } from "@/lib/auth/dev-bypass";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth — middleware already 404s non-admin /admin/* routes,
  // but we re-check here in case middleware is bypassed.
  let isAdmin = false;
  if (isDevBypassEnabled()) {
    isAdmin = STUB_PROFILE.is_admin;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await (supabase.from("profiles") as any)
        .select("is_admin")
        .eq("id", user.id)
        .single();
      isAdmin = (data as { is_admin?: boolean } | null)?.is_admin ?? false;
    }
  }
  if (!isAdmin) notFound();

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[11.5px] text-text-3 hover:text-text-1 mb-3 transition"
      >
        <ChevronLeft className="h-3 w-3" />
        Back to the Handbook
      </Link>
      {children}
    </div>
  );
}
