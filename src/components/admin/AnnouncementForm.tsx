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

type AuthorOption = { id: string; full_name: string };

const CATEGORIES = [
  { value: "new", label: "New (announcement / launch)" },
  { value: "reminder", label: "Reminder" },
  { value: "access", label: "Access / credentials" },
  { value: "ops", label: "Operations" },
  { value: "tools", label: "Tools" },
  { value: "team", label: "Team" },
] as const;

export type AnnouncementInitial = {
  id?: string;
  title?: string;
  body?: string;
  category?: typeof CATEGORIES[number]["value"];
  posted_by_id?: string | null;
  is_pinned?: boolean;
};

export function AnnouncementForm({
  initial,
  authorOptions,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: AnnouncementInitial;
  authorOptions: AuthorOption[];
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [category, setCategory] = useState(initial?.category ?? "ops");
  const [postedById, setPostedById] = useState(initial?.posted_by_id ?? "");
  const [isPinned, setIsPinned] = useState(initial?.is_pinned ?? false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("body", body);
    fd.set("category", category);
    fd.set("posted_by_id", postedById);
    fd.set("is_pinned", String(isPinned));

    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/announcements");
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
              placeholder="New SOP published"
              required
            />
          </FormField>
          <FormField
            label="Body"
            hint="One sentence. Shown in the home ticker and announcement archive."
            required
          >
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Social Media Crisis Response is now in the SOPs section."
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
            <FormField label="Posted by">
              <Select
                value={postedById ?? ""}
                onChange={(e) => setPostedById(e.target.value)}
              >
                <option value="">— Operations —</option>
                {authorOptions.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name}
                  </option>
                ))}
              </Select>
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-nexa-purple cursor-pointer"
              />
              <span className="text-[12.5px] text-text-1">
                Pin to top of ticker
              </span>
            </label>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/announcements">
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
