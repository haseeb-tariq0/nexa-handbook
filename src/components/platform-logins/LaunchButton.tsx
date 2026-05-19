"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Check, LogIn, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "copied" | "no-credential" | "error";

const RESET_AFTER_MS = 2_500;
const CLEAR_CLIPBOARD_AFTER_MS = 30_000;

export function LaunchButton({
  url,
  credential,
  className,
}: {
  url: string | null;
  credential: string | null;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  if (!url) return null;

  async function launch() {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

    let copied = false;
    if (credential && credential.trim()) {
      try {
        await navigator.clipboard.writeText(credential);
        copied = true;
      } catch {
        copied = false;
      }
    }

    // Open the platform in a new tab regardless — user gesture is still
    // attributed to this click so popup blockers leave us alone.
    window.open(url!, "_blank", "noopener,noreferrer");

    if (copied) {
      setStatus("copied");
      // Auto-clear clipboard after a window of opportunity for pasting.
      clearTimerRef.current = setTimeout(async () => {
        try {
          await navigator.clipboard.writeText("");
        } catch {
          // Browsers may refuse a non-user-initiated write — that's fine,
          // we'll be overwritten by whatever the user copies next anyway.
        }
      }, CLEAR_CLIPBOARD_AFTER_MS);
    } else if (credential) {
      setStatus("error");
    } else {
      setStatus("no-credential");
    }

    resetTimerRef.current = setTimeout(() => setStatus("idle"), RESET_AFTER_MS);
  }

  const labels: Record<Status, { text: string; icon: React.ReactNode }> = {
    idle: {
      text: credential ? "Launch & copy password" : "Open",
      icon: credential ? (
        <LogIn className="h-3.5 w-3.5" />
      ) : (
        <ExternalLink className="h-3.5 w-3.5" />
      ),
    },
    copied: {
      text: "Copied — paste with Ctrl + V",
      icon: <Check className="h-3.5 w-3.5" />,
    },
    "no-credential": {
      text: "Opened (no password to copy)",
      icon: <ExternalLink className="h-3.5 w-3.5" />,
    },
    error: {
      text: "Couldn't copy — copy manually",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
    },
  };
  const label = labels[status];

  return (
    <button
      type="button"
      onClick={launch}
      title={
        credential
          ? "Opens the tool in a new tab and copies the password to your clipboard. Clipboard auto-clears in 30 seconds."
          : "Opens the tool in a new tab."
      }
      className={cn(
        "w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[12px] font-semibold transition shadow-sm",
        status === "idle" &&
          "bg-text-1 text-white hover:bg-nexa-purple",
        status === "copied" &&
          "bg-status-green-bg text-status-green border border-status-green/30",
        status === "no-credential" &&
          "bg-panel-2 text-text-2 border border-border",
        status === "error" &&
          "bg-status-rose-bg text-status-rose border border-status-rose/30",
        className,
      )}
    >
      {label.icon}
      {label.text}
    </button>
  );
}
