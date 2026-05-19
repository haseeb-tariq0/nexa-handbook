"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X } from "lucide-react";
import { FormField, TextInput, Textarea, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const LINKED_SECTIONS = [
  { value: "", label: "— No link —" },
  { value: "sops", label: "SOPs" },
  { value: "team", label: "Team Directory" },
  { value: "departments", label: "Departments" },
  { value: "documents", label: "Documents" },
  { value: "platform-logins", label: "Platform Logins" },
  { value: "internal-comms", label: "Internal Comms" },
  { value: "nexa-tools", label: "NEXA Tools" },
  { value: "profile", label: "Profile" },
];

export type OnboardingStepInitial = {
  id?: string;
  title?: string;
  description?: string | null;
  day_label?: string;
  linked_section?: string | null;
  external_url?: string | null;
  sort_order?: number;
};

export function OnboardingStepForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: OnboardingStepInitial;
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dayLabel, setDayLabel] = useState(initial?.day_label ?? "Day 1");
  const [linked, setLinked] = useState(initial?.linked_section ?? "");
  const [extUrl, setExtUrl] = useState(initial?.external_url ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("day_label", dayLabel);
    fd.set("linked_section", linked);
    fd.set("external_url", extUrl);
    fd.set("sort_order", String(sortOrder));
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/onboarding-steps");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2">
        <CardBody className="space-y-4">
          <FormField label="Title" required>
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required />
          </FormField>
          <FormField label="Description">
            <Textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </FormField>
        </CardBody>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField
              label="Day label"
              hint='Free text like "Day 1", "Day 1–2".'
              required
            >
              <TextInput
                value={dayLabel}
                onChange={(e) => setDayLabel(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Link to section">
              <Select value={linked ?? ""} onChange={(e) => setLinked(e.target.value)}>
                {LINKED_SECTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label="External URL"
              hint="Optional. If set, the Open button goes here instead of the linked section."
            >
              <TextInput
                type="url"
                value={extUrl ?? ""}
                onChange={(e) => setExtUrl(e.target.value)}
                placeholder="https://…"
              />
            </FormField>
            <FormField label="Sort order" required>
              <TextInput
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </FormField>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/onboarding-steps">
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
