"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATFORM_CATEGORY_LABELS } from "@/lib/constants";
import { platformIcon } from "@/lib/platform-icons";
import { CredentialReveal } from "@/components/platform-logins/CredentialReveal";
import { LaunchButton } from "@/components/platform-logins/LaunchButton";
import type { PlatformLoginListItem } from "@/lib/queries/platform-logins";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

function hostFromUrl(url: string | null) {
  if (!url) return null;
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function PlatformList({
  tools,
  isAdmin = false,
}: {
  tools: PlatformLoginListItem[];
  isAdmin?: boolean;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return tools.filter((t) => {
      if (cat && t.category !== cat) return false;
      if (!needle) return true;
      return (
        t.tool_name.toLowerCase().includes(needle) ||
        t.description?.toLowerCase().includes(needle) ||
        t.login_identifier?.toLowerCase().includes(needle)
      );
    });
  }, [tools, q, cat]);

  const categories = Object.entries(PLATFORM_CATEGORY_LABELS).filter(([key]) =>
    tools.some((t) => t.category === key),
  );

  return (
    <>
      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-4 pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools…"
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-panel border border-border rounded-md outline-none focus:border-nexa-purple transition"
          />
        </div>
        <div className="text-[11.5px] text-text-3 ml-auto">
          {filtered.length} of {tools.length}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        <FilterPill active={cat === null} onClick={() => setCat(null)}>
          All
        </FilterPill>
        {categories.map(([key, label]) => (
          <FilterPill
            key={key}
            active={cat === key}
            onClick={() => setCat(key)}
          >
            {label}
          </FilterPill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-panel border border-dashed border-border rounded-md p-12 text-center">
          <p className="text-[12.5px] text-text-3">
            No tools match your filter.
          </p>
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 text-[12px] font-medium rounded-full border transition whitespace-nowrap",
        active
          ? "bg-text-1 text-white border-text-1"
          : "bg-panel text-text-2 border-border hover:border-border-3 hover:text-text-1",
      )}
    >
      {children}
    </button>
  );
}

function ToolCard({
  tool,
  isAdmin = false,
}: {
  tool: PlatformLoginListItem;
  isAdmin?: boolean;
}) {
  const host = hostFromUrl(tool.tool_url);
  const valid = formatDate(tool.valid_until);
  const Icon = platformIcon(tool.category);

  return (
    <div className="group relative bg-panel border border-border rounded-md p-5 hover:border-border-3 transition flex flex-col">
      {isAdmin && (
        <Link
          href={`/admin/platform-logins/${tool.id}`}
          className="absolute top-3 right-3 inline-flex items-center justify-center h-7 w-7 rounded text-text-4 hover:text-nexa-purple hover:bg-nexa-purple-tint transition opacity-0 group-hover:opacity-100"
          aria-label="Edit in admin"
          title="Edit"
        >
          <Pencil className="h-3 w-3" />
        </Link>
      )}

      {/* Header: icon + name + description */}
      <div className="flex items-start gap-3 mb-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-nexa-purple-tint text-nexa-purple shrink-0">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1 pr-7">
          <div className="text-[14px] font-semibold text-text-1 leading-tight truncate">
            {tool.tool_name}
          </div>
          {tool.description && (
            <div className="text-[11px] text-text-3 leading-snug mt-0.5 line-clamp-2">
              {tool.description}
            </div>
          )}
        </div>
      </div>

      {/* Rows */}
      <dl className="space-y-2 mb-4">
        <Row label="Login">
          <span className="text-[11.5px] text-text-2 truncate">
            {tool.login_identifier ?? "—"}
          </span>
        </Row>
        <Row label="Password">
          <CredentialReveal value={tool.credential_value} />
        </Row>
        {tool.price && (
          <Row label="Price">
            <span className="text-[11.5px] text-text-1 font-medium">
              {tool.price}
            </span>
          </Row>
        )}
        <Row label="Access">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-nexa-purple-tint text-nexa-purple text-[10.5px] font-semibold">
            {tool.access_notes
              ? truncate(tool.access_notes, 18)
              : PLATFORM_CATEGORY_LABELS[tool.category] ?? tool.category}
          </span>
        </Row>
      </dl>

      {valid && (
        <div className="text-[10.5px] text-text-4 italic mb-3">
          Valid until {valid}
        </div>
      )}

      {/* Footer: Launch button + domain link */}
      <div className="mt-auto space-y-2">
        <LaunchButton
          url={tool.tool_url}
          credential={tool.credential_value}
        />
        {tool.tool_url && host && (
          <a
            href={tool.tool_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10.5px] text-text-4 hover:text-text-2 transition"
          >
            {host}
            <ArrowUpRight className="h-2.5 w-2.5" />
          </a>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 min-w-0">
      <dt className="text-[10.5px] uppercase tracking-wider text-text-4 font-medium shrink-0">
        {label}
      </dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}

function truncate(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}
