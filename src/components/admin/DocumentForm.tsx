"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X } from "lucide-react";
import {
  FormField,
  TextInput,
  Textarea,
  Select,
} from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const CATEGORIES = [
  { value: "brand", label: "Brand" },
  { value: "templates", label: "Templates" },
  { value: "policies", label: "Policies" },
  { value: "onboarding", label: "Onboarding" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "creative", label: "Creative" },
  { value: "ai_tech", label: "AI & Tech" },
] as const;

const FILE_TYPES = [
  { value: "", label: "— Auto / unspecified —" },
  { value: "gdoc", label: "Google Doc" },
  { value: "gsheet", label: "Google Sheet" },
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "Word (.docx)" },
  { value: "pptx", label: "Slides (.pptx)" },
  { value: "video", label: "Video" },
  { value: "link", label: "Link" },
];

type Option = { id: string; label: string };

export type DocumentInitial = {
  id?: string;
  title?: string;
  description?: string | null;
  category?: typeof CATEGORIES[number]["value"];
  external_url?: string;
  file_type?: string | null;
  owner_id?: string | null;
  is_published?: boolean;
};

export function DocumentForm({
  initial,
  ownerOptions,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: DocumentInitial;
  ownerOptions: Option[];
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "brand");
  const [externalUrl, setExternalUrl] = useState(initial?.external_url ?? "");
  const [fileType, setFileType] = useState(initial?.file_type ?? "");
  const [ownerId, setOwnerId] = useState(initial?.owner_id ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("category", category);
    fd.set("external_url", externalUrl);
    fd.set("file_type", fileType);
    fd.set("owner_id", ownerId);
    fd.set("is_published", String(isPublished));
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/documents");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2">
        <CardBody className="space-y-4">
          <FormField label="Title" required>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="NEXA Brand Guidelines"
              required
            />
          </FormField>
          <FormField label="Description">
            <Textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Logo usage, colours, typography, voice."
            />
          </FormField>
          <FormField
            label="External URL"
            hint="Where the document actually lives — Drive, Notion, etc."
            required
          >
            <TextInput
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://drive.google.com/…"
              required
            />
          </FormField>
        </CardBody>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Category" required>
              <Select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as typeof category)
                }
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="File type" hint="Affects the icon shown.">
              <Select
                value={fileType ?? ""}
                onChange={(e) => setFileType(e.target.value)}
              >
                {FILE_TYPES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Owner">
              <Select
                value={ownerId ?? ""}
                onChange={(e) => setOwnerId(e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {ownerOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-nexa-purple cursor-pointer"
              />
              <span className="text-[12.5px] text-text-1">Published</span>
            </label>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/documents">
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
