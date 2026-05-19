"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, ExternalLink } from "lucide-react";
import {
  FormField,
  TextInput,
  Textarea,
  Select,
} from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

type Option = { id: string; label: string };

export type SopInitial = {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string | null;
  body?: string | null;
  department_id?: string | null;
  owner_id?: string | null;
  external_link?: string | null;
  last_reviewed_at?: string | null;
  is_published?: boolean;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function dateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function SopForm({
  initial,
  departmentOptions,
  ownerOptions,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: SopInitial;
  departmentOptions: Option[];
  ownerOptions: Option[];
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [deptId, setDeptId] = useState(initial?.department_id ?? "");
  const [ownerId, setOwnerId] = useState(initial?.owner_id ?? "");
  const [externalLink, setExternalLink] = useState(initial?.external_link ?? "");
  const [lastReviewed, setLastReviewed] = useState(
    dateInputValue(initial?.last_reviewed_at),
  );
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleNameChange(v: string) {
    setTitle(v);
    if (!initial?.id) {
      setSlug((curr) =>
        curr === "" || curr === slugify(title) ? slugify(v) : curr,
      );
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("summary", summary);
    fd.set("body", body);
    fd.set("department_id", deptId);
    fd.set("owner_id", ownerId);
    fd.set("external_link", externalLink);
    fd.set("last_reviewed_at", lastReviewed);
    fd.set("is_published", String(isPublished));
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/sops");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Title" required>
              <TextInput
                value={title}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Slug" required>
              <TextInput
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                pattern="[a-z0-9-]+"
              />
            </FormField>
            <FormField
              label="Summary"
              hint="One sentence shown in lists."
            >
              <Textarea
                value={summary ?? ""}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
              />
            </FormField>
          </CardBody>
        </Card>

        <FormField
          label="Body (Markdown)"
          hint="Headings, lists, links — see preview. Leave blank if you only want to link to an external doc."
        >
          <MarkdownEditor value={body ?? ""} onChange={setBody} rows={18} />
        </FormField>
      </div>

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Department">
              <Select value={deptId ?? ""} onChange={(e) => setDeptId(e.target.value)}>
                <option value="">— Unassigned —</option>
                {departmentOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Owner">
              <Select value={ownerId ?? ""} onChange={(e) => setOwnerId(e.target.value)}>
                <option value="">— Unassigned —</option>
                {ownerOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Last reviewed">
              <TextInput
                type="date"
                value={lastReviewed}
                onChange={(e) => setLastReviewed(e.target.value)}
              />
            </FormField>
            <FormField
              label="External link"
              hint="Optional. If set, an Open external version button appears on the SOP page."
            >
              <div className="flex items-center gap-2">
                <TextInput
                  type="url"
                  value={externalLink ?? ""}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://docs.google.com/…"
                />
                {externalLink && (
                  <a
                    href={externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md text-text-3 hover:text-nexa-purple hover:bg-panel-2 transition"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-nexa-purple cursor-pointer"
              />
              <span className="text-[12.5px] text-text-1">
                Published (visible to all employees)
              </span>
            </label>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/sops">
            <Button type="button" variant="secondary">
              <X className="h-3 w-3" />
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" loading={pending}>
            <Save className="h-3 w-3" />
            {submitLabel}
          </Button>
        </div>

        {error && (
          <div className="text-[11.5px] text-status-rose bg-status-rose-bg border border-status-rose/30 rounded px-3 py-2">
            {error}
          </div>
        )}
      </div>
    </form>
  );
}
