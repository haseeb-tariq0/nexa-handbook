"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function CredentialReveal({
  value,
  className,
}: {
  value: string | null;
  className?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!value) {
    return (
      <span className={cn("text-[11.5px] text-text-4 italic", className)}>
        Not set
      </span>
    );
  }

  // If the value reads like a note ("Sign in with Google", "Ask Nikhil for 2FA"),
  // show it inline — there is no secret to mask.
  const isNote =
    value.toLowerCase().includes("sign in with") ||
    value.toLowerCase().includes("sso") ||
    value.toLowerCase().includes("ask ");

  if (isNote) {
    return (
      <span
        className={cn(
          "inline-flex items-center text-[11.5px] text-text-3 italic truncate max-w-[160px]",
          className,
        )}
        title={value}
      >
        {value}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      className={cn(
        "inline-flex items-center gap-1.5 group cursor-pointer select-all",
        className,
      )}
      aria-label={revealed ? "Hide credential" : "Reveal credential"}
    >
      <span
        className={cn(
          "font-mono text-[12px] text-text-1",
          !revealed && "tracking-[2px] text-text-3",
        )}
      >
        {revealed ? value : "••••••••"}
      </span>
      {revealed ? (
        <EyeOff className="h-3 w-3 text-text-3 group-hover:text-text-1 transition" />
      ) : (
        <Eye className="h-3 w-3 text-text-3 group-hover:text-text-1 transition" />
      )}
    </button>
  );
}
