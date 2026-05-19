"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setIntendedAdmin } from "@/app/(app)/admin/users/actions";

export function IntendedAdminToggle({
  teamMemberId,
  intended: initial,
  envOverride = false,
}: {
  teamMemberId: string;
  intended: boolean;
  /** True when this role is currently coming from ADMIN_EMAILS (no explicit toggle). */
  envOverride?: boolean;
}) {
  const [intended, setIntended] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [explicit, setExplicit] = useState(!envOverride);

  function toggle() {
    if (pending) return;
    const target = !intended;
    setError(null);
    setIntended(target);
    setExplicit(true);
    startTransition(async () => {
      const res = await setIntendedAdmin(teamMemberId, target);
      if (!res.ok) {
        setIntended(!target);
        setExplicit(envOverride);
        setError(res.error);
      }
    });
  }

  const showEnvHint = !explicit;

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={intended}
        title={
          intended
            ? "Will be Admin on first sign-in — click to change to Member"
            : "Will be Member on first sign-in — click to make Admin"
        }
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10.5px] font-semibold transition cursor-pointer",
          intended
            ? "bg-nexa-purple-tint text-nexa-purple border-nexa-purple/20 hover:bg-nexa-purple hover:text-white"
            : "bg-panel-2 text-text-2 border-border hover:bg-panel hover:border-border-3",
          pending && "opacity-60 cursor-not-allowed",
        )}
      >
        {pending ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
        ) : intended ? (
          <ShieldCheck className="h-2.5 w-2.5" />
        ) : (
          <ShieldOff className="h-2.5 w-2.5" />
        )}
        {intended ? "Will be Admin" : "Will be Member"}
      </button>
      {showEnvHint && !error && (
        <span
          className="text-[9.5px] text-text-4 mt-0.5"
          title="Coming from ADMIN_EMAILS env var; toggle to override"
        >
          via env
        </span>
      )}
      {error && (
        <span className="text-[9.5px] text-status-rose mt-0.5" title={error}>
          Save failed
        </span>
      )}
    </div>
  );
}
