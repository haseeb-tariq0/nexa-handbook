"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  className,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      remove(value[value.length - 1]);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 px-2 py-1.5 bg-panel border border-border rounded-md focus-within:border-nexa-purple transition min-h-[38px]",
        className,
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-nexa-purple-tint text-nexa-purple text-[11px] font-medium rounded"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            className="hover:bg-nexa-purple hover:text-white rounded-full p-0.5 transition"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => draft && add(draft)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] bg-transparent outline-none text-[12.5px] py-1 px-1 placeholder:text-text-4"
      />
    </div>
  );
}
