"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { TEMPLATE_CATEGORY_LABELS } from "@/lib/constants";
import type { MessageTemplateListItem } from "@/lib/queries/comms";
import { incrementTemplateUsage } from "@/app/(app)/internal-comms/actions";

export function TemplateCard({ tpl }: { tpl: MessageTemplateListItem }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyAndIncrement() {
    try {
      await navigator.clipboard.writeText(tpl.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      await incrementTemplateUsage(tpl.id);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="bg-panel border border-border rounded-md p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <Badge variant="indigo">
            {TEMPLATE_CATEGORY_LABELS[tpl.category] ?? tpl.category}
          </Badge>
          <h3 className="text-[13.5px] font-semibold text-text-1 mt-2">
            {tpl.title}
          </h3>
        </div>
        <span className="text-[10px] text-text-4 shrink-0 whitespace-nowrap mt-1">
          {tpl.usage_count} {tpl.usage_count === 1 ? "use" : "uses"}
        </span>
      </div>

      {tpl.description && (
        <p className="text-[11.5px] text-text-3 leading-relaxed mb-3 line-clamp-2">
          {tpl.description}
        </p>
      )}

      {expanded && (
        <pre className="mt-2 mb-3 p-3 bg-panel-2 border border-border rounded text-[11.5px] text-text-2 whitespace-pre-wrap font-mono leading-relaxed max-h-[280px] overflow-y-auto">
          {tpl.body}
        </pre>
      )}

      <div className="mt-auto pt-3 border-t border-border flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-1 text-[11.5px] text-text-3 hover:text-text-1 transition"
        >
          <ChevronDown
            className={cn("h-3 w-3 transition", expanded && "rotate-180")}
          />
          {expanded ? "Hide" : "Preview"}
        </button>
        <button
          type="button"
          onClick={copyAndIncrement}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11.5px] font-medium transition",
            copied
              ? "bg-status-green-bg text-status-green"
              : "bg-text-1 text-white hover:bg-nexa-purple",
          )}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Use template"}
        </button>
      </div>

      {tpl.owner && (
        <div className="mt-2 text-[10px] text-text-4">
          Owned by {tpl.owner.full_name}
        </div>
      )}
    </div>
  );
}
