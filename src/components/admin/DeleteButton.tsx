"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DeleteButton({
  onDelete,
  itemLabel,
}: {
  onDelete: () => Promise<{ ok: boolean; error?: string }>;
  itemLabel: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${itemLabel}`}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-[11px] text-text-3">Delete?</span>
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={() =>
          startTransition(async () => {
            const result = await onDelete();
            if (!result.ok) {
              setError(result.error ?? "Delete failed");
              setConfirming(false);
            }
          })
        }
        loading={pending}
      >
        Yes
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(false)}
      >
        No
      </Button>
      {error && (
        <span className="text-[10.5px] text-status-rose ml-1">{error}</span>
      )}
    </div>
  );
}
