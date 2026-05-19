"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side, this is already logged. Client-side, log once.
    console.error("App route error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-status-rose-bg text-status-rose mb-5">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h1 className="text-[20px] font-semibold text-text-1 mb-2">
        Something went wrong on this page.
      </h1>
      <p className="text-[13px] text-text-3 max-w-md mx-auto leading-relaxed mb-6">
        We couldn&rsquo;t finish loading what you asked for. Try again — if it
        keeps happening, ping the Operations Manager.
      </p>
      <div className="flex items-center justify-center gap-2">
        <Button onClick={reset} variant="primary">
          <RotateCw className="h-3 w-3" />
          Try again
        </Button>
        <Link href="/">
          <Button variant="secondary">
            <Home className="h-3 w-3" />
            Go home
          </Button>
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-[10px] text-text-4 font-mono">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
