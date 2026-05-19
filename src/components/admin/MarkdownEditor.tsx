"use client";

import { useState } from "react";
import { Eye, Code } from "lucide-react";
import { Textarea } from "@/components/ui/FormField";
import { Markdown } from "@/components/ui/Markdown";
import { cn } from "@/lib/utils";

export function MarkdownEditor({
  value,
  onChange,
  rows = 18,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [mode, setMode] = useState<"write" | "split" | "preview">("split");

  return (
    <div className="border border-border rounded-md overflow-hidden bg-panel">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-panel-2 border-b border-border">
        <div className="text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
          Markdown
        </div>
        <div className="inline-flex items-center gap-0.5 bg-panel border border-border rounded p-0.5">
          {[
            { value: "write", label: "Write", icon: Code },
            { value: "split", label: "Split", icon: null },
            { value: "preview", label: "Preview", icon: Eye },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value as typeof mode)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-medium rounded transition",
                  mode === m.value
                    ? "bg-nexa-purple text-white"
                    : "text-text-3 hover:text-text-1",
                )}
              >
                {Icon && <Icon className="h-2.5 w-2.5" />}
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "grid",
          mode === "split" ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {(mode === "write" || mode === "split") && (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder ?? "## Heading\n\nWrite your SOP body here…"}
            className="border-0 rounded-none focus:!border-transparent !bg-panel font-mono text-[12.5px]"
          />
        )}
        {(mode === "preview" || mode === "split") && (
          <div
            className={cn(
              "px-5 py-4 overflow-y-auto",
              mode === "split" && "border-l border-border",
            )}
            style={{ maxHeight: `${rows * 1.5}em` }}
          >
            {value.trim() ? (
              <Markdown source={value} />
            ) : (
              <p className="text-[12px] text-text-4 italic">
                Preview appears as you type.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
