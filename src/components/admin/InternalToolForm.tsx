"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X } from "lucide-react";
import { FormField, TextInput, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export type InternalToolInitial = {
  id?: string;
  name?: string;
  url?: string;
  description?: string | null;
  icon_emoji?: string | null;
  accent_color?: string | null;
  is_live?: boolean;
  sort_order?: number;
};

export function InternalToolForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: InternalToolInitial;
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [emoji, setEmoji] = useState(initial?.icon_emoji ?? "");
  const [color, setColor] = useState(initial?.accent_color ?? "#9334FF");
  const [isLive, setIsLive] = useState(initial?.is_live ?? true);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("url", url);
    fd.set("description", description);
    fd.set("icon_emoji", emoji);
    fd.set("accent_color", color);
    fd.set("is_live", String(isLive));
    fd.set("sort_order", String(sortOrder));
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/internal-tools");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2">
        <CardBody className="space-y-4">
          <FormField label="Name" required>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
          </FormField>
          <FormField label="URL" required>
            <TextInput
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://pricingcalc.digitalnexa.com"
              required
            />
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
            <FormField label="Icon (emoji)" hint="Single emoji shown on the card.">
              <TextInput
                value={emoji ?? ""}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🧮"
                maxLength={4}
              />
            </FormField>
            <FormField label="Accent colour">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-12 rounded border border-border cursor-pointer bg-panel"
                />
                <TextInput
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#9334FF"
                  className="font-mono uppercase"
                  pattern="#[0-9A-Fa-f]{6}"
                />
              </div>
            </FormField>
            <FormField label="Sort order" hint="Lower numbers appear first.">
              <TextInput
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isLive}
                onChange={(e) => setIsLive(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-nexa-purple cursor-pointer"
              />
              <span className="text-[12.5px] text-text-1">Live (shown to users)</span>
            </label>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/internal-tools">
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
