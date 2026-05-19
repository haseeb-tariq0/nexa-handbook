"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FormField,
  TextInput,
  Textarea,
  Select,
} from "@/components/ui/FormField";
import { TagInput } from "@/components/ui/TagInput";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Save, X } from "lucide-react";

type LeadOption = { id: string; full_name: string };

export type DepartmentInitial = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  core_expertise?: string[];
  key_tools?: string[];
  lead_id?: string | null;
  sort_order?: number;
};

export function DepartmentForm({
  initial,
  leadOptions,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: DepartmentInitial;
  leadOptions: LeadOption[];
  onSubmit: (
    formData: FormData,
  ) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [expertise, setExpertise] = useState<string[]>(
    initial?.core_expertise ?? [],
  );
  const [tools, setTools] = useState<string[]>(initial?.key_tools ?? []);
  const [leadId, setLeadId] = useState(initial?.lead_id ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Auto-derive slug from name unless user typed slug manually
  function slugify(input: string) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function handleNameChange(v: string) {
    setName(v);
    if (!initial?.id) {
      // only auto-slug on create
      setSlug((current) =>
        current === slugify(name) || current === "" ? slugify(v) : current,
      );
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("slug", slug);
    fd.set("description", description);
    fd.set("core_expertise", JSON.stringify(expertise));
    fd.set("key_tools", JSON.stringify(tools));
    fd.set("lead_id", leadId);
    fd.set("sort_order", String(sortOrder));

    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) {
        setError(res.error ?? "Save failed");
      } else {
        router.push("/admin/departments");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Name" required>
              <TextInput
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Creative"
                required
              />
            </FormField>
            <FormField
              label="Slug"
              hint="URL-friendly identifier. Auto-generated from name on create."
              required
            >
              <TextInput
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="creative"
                required
                pattern="[a-z0-9-]+"
              />
            </FormField>
            <FormField
              label="Description"
              hint="One paragraph — what does this department do?"
            >
              <Textarea
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Design, art direction, and brand work across all NEXA clients."
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <FormField
              label="Core expertise"
              hint="Tags shown on the department card. Press Enter to add."
            >
              <TagInput
                value={expertise}
                onChange={setExpertise}
                placeholder="Brand identity"
              />
            </FormField>
            <FormField
              label="Key tools"
              hint="Tools the department uses day-to-day."
            >
              <TagInput
                value={tools}
                onChange={setTools}
                placeholder="Figma"
              />
            </FormField>
          </CardBody>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField
              label="Lead"
              hint="The team member who heads this department."
            >
              <Select
                value={leadId ?? ""}
                onChange={(e) => setLeadId(e.target.value)}
              >
                <option value="">— No lead —</option>
                {leadOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.full_name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="Sort order"
              hint="Lower numbers appear first."
            >
              <TextInput
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </FormField>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2 pt-1">
          <Link href="/admin/departments">
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
