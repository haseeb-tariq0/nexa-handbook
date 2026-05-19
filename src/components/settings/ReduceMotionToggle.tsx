"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nexa:reduce-motion";

export function ReduceMotionToggle() {
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) === "1";
    setOn(stored);
    document.documentElement.dataset.reduceMotion = stored ? "1" : "";
  }, []);

  function toggle() {
    const next = !on;
    setOn(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, "1");
      document.documentElement.dataset.reduceMotion = "1";
    } else {
      localStorage.removeItem(STORAGE_KEY);
      delete document.documentElement.dataset.reduceMotion;
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mounted ? on : false}
      onClick={toggle}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        on ? "bg-nexa-purple" : "bg-border-3",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
