"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X } from "lucide-react";
import { FormField, TextInput, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

export type OnboardingVideoInitial = {
  id?: string;
  title?: string;
  description?: string | null;
  video_url?: string;
  thumbnail_url?: string | null;
  duration_label?: string | null;
  sort_order?: number;
  is_active?: boolean;
};

export function OnboardingVideoForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: OnboardingVideoInitial;
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? "");
  const [thumbUrl, setThumbUrl] = useState(initial?.thumbnail_url ?? "");
  const [duration, setDuration] = useState(initial?.duration_label ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("description", description);
    fd.set("video_url", videoUrl);
    fd.set("thumbnail_url", thumbUrl);
    fd.set("duration_label", duration);
    fd.set("sort_order", String(sortOrder));
    fd.set("is_active", isActive ? "on" : "");
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/onboarding-videos");
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
              required
              placeholder="Welcome to NEXA — Ops Walkthrough"
            />
          </FormField>
          <FormField label="Description" hint="Shown under the title on the video card.">
            <Textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Operations Team · Added Mar 2026"
            />
          </FormField>
          <FormField label="Video URL" required hint="YouTube, Vimeo, Loom, or any external host.">
            <TextInput
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </FormField>
          <FormField
            label="Thumbnail URL"
            hint="Optional. If empty, we show a brand-coloured tile with a play icon."
          >
            <TextInput
              type="url"
              value={thumbUrl ?? ""}
              onChange={(e) => setThumbUrl(e.target.value)}
              placeholder="https://…"
            />
          </FormField>
        </CardBody>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Duration label" hint='Free text — e.g. "5:32".'>
              <TextInput
                value={duration ?? ""}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="5:32"
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
            <FormField
              label="Visibility"
              hint="Inactive videos are hidden from the public onboarding page."
            >
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-3.5 w-3.5 accent-nexa-purple"
                />
                <span className="text-[12.5px] text-text-1">Active</span>
              </label>
            </FormField>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/onboarding-videos">
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
