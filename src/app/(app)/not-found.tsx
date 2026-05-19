import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-nexa-purple-tint text-nexa-purple mb-5">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="text-[24px] font-semibold text-text-1 mb-2">Not found.</h1>
      <p className="text-[13px] text-text-3 max-w-md mx-auto leading-relaxed mb-6">
        We can&rsquo;t find the page you&rsquo;re looking for. It may have been
        renamed or deleted.
      </p>
      <Link href="/">
        <Button variant="primary">
          <Home className="h-3 w-3" />
          Go home
        </Button>
      </Link>
    </div>
  );
}
