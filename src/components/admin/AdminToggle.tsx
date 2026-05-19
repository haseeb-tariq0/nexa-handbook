"use client";

import { useState, useTransition } from "react";
import { ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setUserAdmin } from "@/app/(app)/admin/users/actions";

export function AdminToggle({
  userId,
  isAdmin: initial,
  disabled,
  reason,
}: {
  userId: string;
  isAdmin: boolean;
  disabled?: boolean;
  reason?: string;
}) {
  const [isAdmin, setIsAdmin] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    if (disabled || pending) return;
    const target = !isAdmin;
    const ok = window.confirm(
      target
        ? "Promote this user to Admin? They will be able to create, edit, and delete content across the Handbook."
        : "Demote this user to Member? They will lose access to /admin/* immediately on their next request.",
    );
    if (!ok) return;

    setError(null);
    setIsAdmin(target);
    startTransition(async () => {
      const res = await setUserAdmin(userId, target);
      if (!res.ok) {
        setIsAdmin(!target);
        setError(res.error);
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || pending}
        aria-pressed={isAdmin}
        title={
          disabled
            ? reason
            : isAdmin
              ? "Click to demote to Member"
              : "Click to promote to Admin"
        }
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10.5px] font-semibold transition cursor-pointer",
          isAdmin
            ? "bg-nexa-purple-tint text-nexa-purple border-nexa-purple/20 hover:bg-nexa-purple hover:text-white"
            : "bg-panel-2 text-text-2 border-border hover:bg-panel hover:border-border-3",
          (disabled || pending) && "opacity-60 cursor-not-allowed hover:bg-inherit hover:text-inherit",
        )}
      >
        {pending ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin" />
        ) : isAdmin ? (
          <ShieldCheck className="h-2.5 w-2.5" />
        ) : (
          <ShieldOff className="h-2.5 w-2.5" />
        )}
        {isAdmin ? "Admin" : "Member"}
      </button>
      {error && (
        <span className="text-[9.5px] text-status-rose mt-0.5" title={error}>
          Save failed
        </span>
      )}
    </div>
  );
}
