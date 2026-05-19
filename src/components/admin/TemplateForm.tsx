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
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

const CATEGORIES = [
  { value: "client_facing", label: "Client-facing" },
  { value: "internal", label: "Internal" },
  { value: "announcement", label: "Announcement" },
  { value: "hr", label: "HR" },
  { value: "meeting", label: "Meeting" },
  { value: "escalation", label: "Escalation" },
] as const;

type Option = { id: string; label: string };

export type TemplateInitial = {
  id?: string;
  title?: string;
  description?: string | null;
  body?: string;
  category?: typeof CATEGORIES[number]["value"];
  owner_id?: string | null;
};

export function TemplateForm({
  initial,
  ownerOptions,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: TemplateInitial;
  ownerOptions: Option[];
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [category, setCategory] = useState(initial?.category ?? "internal");
  const [ownerId, setOwnerId] = useState(initial?.owner_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("body", body);
    fd.set("category", category);
    fd.set("owner_id", ownerId);
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/templates");
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Client kick-off email"
                required
              />
            </FormField>
            <FormField label="Description">
              <Textarea
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Used by AMs after a contract is signed."
              />
            </FormField>
          </CardBody>
        </Card>

        <FormField
          label="Body"
          hint={
            "Markdown supported. Use {{placeholders}} for fields the user fills in (e.g. {{client name}})."
          }
          required
        >
          <MarkdownEditor value={body} onChange={setBody} rows={16} />
        </FormField>
      </div>

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
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/templates">
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
