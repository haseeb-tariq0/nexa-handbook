"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  FileText,
  Folder,
  Image as ImageIcon,
  Video,
  Table2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DOC_CATEGORY_LABELS, FILE_TYPE_LABELS } from "@/lib/constants";
import { DocumentCategoryHero } from "@/components/documents/DocumentCategoryHero";
import type { DocumentListItem } from "@/lib/queries/documents";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const fileTypeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  docx: FileText,
  gdoc: FileText,
  pptx: ImageIcon,
  gsheet: Table2,
  video: Video,
  link: Folder,
};

export function DocumentList({
  docs,
  isAdmin = false,
}: {
  docs: DocumentListItem[];
  isAdmin?: boolean;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of docs) {
      map.set(d.category, (map.get(d.category) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }, [docs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return docs.filter((d) => {
      if (cat && d.category !== cat) return false;
      if (!needle) return true;
      return (
        d.title.toLowerCase().includes(needle) ||
        d.description?.toLowerCase().includes(needle)
      );
    });
  }, [docs, q, cat]);

  return (
    <>
      <div className="mb-5">
        <div className="relative max-w-[420px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-4 pointer-events-none" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documents…"
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-panel border border-border rounded-md outline-none focus:border-nexa-purple transition"
          />
        </div>
      </div>

      <DocumentCategoryHero counts={counts} selected={cat} onSelect={setCat} />

      <div className="flex items-center justify-between mb-3">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-text-4 font-semibold">
          {cat
            ? `${DOC_CATEGORY_LABELS[cat] ?? cat} · ${filtered.length}`
            : `Recently updated · ${filtered.length}`}
        </div>
        {cat && (
          <button
            type="button"
            onClick={() => setCat(null)}
            className="text-[11px] text-text-3 hover:text-text-1 transition"
          >
            Clear category
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-panel border border-dashed border-border rounded-md p-12 text-center">
          <p className="text-[12.5px] text-text-3">No documents match.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((d) => {
            const Icon = fileTypeIcon[d.file_type ?? "link"] ?? Folder;
            return (
              <div key={d.id} className="relative">
              {isAdmin && (
                <Link
                  href={`/admin/documents/${d.id}`}
                  className="absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center h-6 w-6 rounded text-text-4 hover:text-nexa-purple hover:bg-nexa-purple-tint transition opacity-0 group-hover:opacity-100"
                  aria-label="Edit"
                  title="Edit"
                >
                  <Pencil className="h-3 w-3" />
                </Link>
              )}
              <a
                href={d.external_url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "group bg-panel border border-border rounded-md p-4 hover:border-section-doc transition flex gap-3",
                )}
              >
                <span className="shrink-0 h-9 w-9 rounded-md bg-[#EEF0FB] text-section-doc inline-flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[13px] font-semibold text-text-1 group-hover:text-section-doc transition truncate">
                      {d.title}
                    </h3>
                    <ExternalLink className="h-3 w-3 text-text-4 group-hover:text-section-doc shrink-0 mt-1 transition" />
                  </div>
                  {d.description && (
                    <p className="text-[11px] text-text-3 mt-0.5 line-clamp-2 leading-snug">
                      {d.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-text-4">
                    <span className="uppercase tracking-wider font-medium">
                      {DOC_CATEGORY_LABELS[d.category] ?? d.category}
                    </span>
                    {d.file_type && (
                      <>
                        <span>·</span>
                        <span>
                          {FILE_TYPE_LABELS[d.file_type] ?? d.file_type}
                        </span>
                      </>
                    )}
                    <span>·</span>
                    <span>{formatDate(d.updated_at)}</span>
                  </div>
                </div>
              </a>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
