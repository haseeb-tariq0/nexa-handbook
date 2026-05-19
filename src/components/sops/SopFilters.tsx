"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SopListItem } from "@/lib/queries/sops";

type DepartmentOption = { id: string; name: string; slug: string };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function SopFilters({
  sops,
  departments,
  isAdmin = false,
}: {
  sops: SopListItem[];
  departments: DepartmentOption[];
  isAdmin?: boolean;
}) {
  const [q, setQ] = useState("");
  const [deptId, setDeptId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sops.filter((s) => {
      if (deptId && s.department_id !== deptId) return false;
      if (!needle) return true;
      return (
        s.title.toLowerCase().includes(needle) ||
        s.summary?.toLowerCase().includes(needle) ||
        s.departments?.name.toLowerCase().includes(needle) ||
        s.owner?.full_name.toLowerCase().includes(needle)
      );
    });
  }, [sops, q, deptId]);

  return (
    <>
      {/* Search + filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-[360px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-4 pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search SOPs…"
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-panel border border-border rounded-md outline-none focus:border-nexa-purple transition"
          />
        </div>
        <div className="text-[11.5px] text-text-3">
          Showing <span className="font-semibold text-text-1">{filtered.length}</span>{" "}
          of {sops.length}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        <FilterPill active={deptId === null} onClick={() => setDeptId(null)}>
          All departments
        </FilterPill>
        {departments.map((d) => (
          <FilterPill
            key={d.id}
            active={deptId === d.id}
            onClick={() => setDeptId(d.id)}
          >
            {d.name}
          </FilterPill>
        ))}
      </div>

      {/* Table */}
      <div className="bg-panel border border-border rounded-md overflow-hidden">
        <div className="grid grid-cols-[1fr_180px_180px_120px] gap-4 px-5 py-3 bg-panel-2 border-b border-border text-[10.5px] uppercase tracking-wider text-text-3 font-semibold">
          <div>SOP</div>
          <div>Department</div>
          <div>Owner</div>
          <div className="text-right">Updated</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-[12.5px] text-text-3">
              No SOPs match your filter.
            </p>
          </div>
        ) : (
          filtered.map((s) => (
            <div
              key={s.id}
              className="relative grid grid-cols-[1fr_180px_180px_120px] gap-4 px-5 py-3.5 items-center border-b border-border last:border-b-0 hover:bg-panel-2 group transition"
            >
              <Link
                href={`/sops/${s.slug}`}
                className="absolute inset-0"
                aria-label={s.title}
              />
              <div className="min-w-0 relative pointer-events-none">
                <div className="text-[13px] font-medium text-text-1 group-hover:text-nexa-purple transition truncate flex items-center gap-1.5">
                  {s.title}
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                {s.summary && (
                  <div className="text-[11.5px] text-text-3 mt-0.5 truncate">
                    {s.summary}
                  </div>
                )}
              </div>
              <div className="text-[11.5px] text-text-2 truncate relative pointer-events-none">
                {s.departments?.name ?? "—"}
              </div>
              <div className="text-[11.5px] text-text-2 truncate relative pointer-events-none">
                {s.owner?.full_name ?? "—"}
              </div>
              <div className="text-[11.5px] text-text-3 text-right relative flex items-center justify-end gap-2">
                <span className="pointer-events-none">{formatDate(s.updated_at)}</span>
                {isAdmin && (
                  <Link
                    href={`/admin/sops/${s.id}`}
                    className="relative inline-flex items-center justify-center h-6 w-6 rounded text-text-4 hover:text-nexa-purple hover:bg-nexa-purple-tint transition opacity-0 group-hover:opacity-100"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Pencil className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
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
        "px-3 py-1.5 text-[11.5px] font-medium rounded-full border transition whitespace-nowrap",
        active
          ? "bg-nexa-purple text-white border-nexa-purple"
          : "bg-panel text-text-2 border-border hover:border-border-3 hover:text-text-1",
      )}
    >
      {children}
    </button>
  );
}
