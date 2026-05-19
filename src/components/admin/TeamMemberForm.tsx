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

type Option = { id: string; label: string };

export type TeamMemberInitial = {
  id?: string;
  email?: string;
  full_name?: string;
  role_title?: string;
  department_id?: string | null;
  slack_handle?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  working_hours?: string | null;
  location?: string | null;
  reports_to?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  sort_order?: number;
};

export function TeamMemberForm({
  initial,
  departmentOptions,
  managerOptions,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: TeamMemberInitial;
  departmentOptions: Option[];
  managerOptions: Option[];
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initial?.email ?? "");
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [roleTitle, setRoleTitle] = useState(initial?.role_title ?? "");
  const [deptId, setDeptId] = useState(initial?.department_id ?? "");
  const [slack, setSlack] = useState(initial?.slack_handle ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [hours, setHours] = useState(initial?.working_hours ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [reportsTo, setReportsTo] = useState(initial?.reports_to ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Filter out self from manager options when editing
  const managers = initial?.id
    ? managerOptions.filter((m) => m.id !== initial.id)
    : managerOptions;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("email", email);
    fd.set("full_name", fullName);
    fd.set("role_title", roleTitle);
    fd.set("department_id", deptId);
    fd.set("slack_handle", slack);
    fd.set("phone", phone);
    fd.set("whatsapp", whatsapp);
    fd.set("working_hours", hours);
    fd.set("location", location);
    fd.set("reports_to", reportsTo);
    fd.set("bio", bio);
    fd.set("avatar_url", avatarUrl);
    fd.set("is_active", String(isActive));
    fd.set("sort_order", String(sortOrder));
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/team");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Full name" required>
              <TextInput
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </FormField>
            <FormField label="Email" required>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@digitalnexa.com"
              />
            </FormField>
            <FormField label="Role title" required>
              <TextInput
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Senior Designer"
                required
              />
            </FormField>
            <FormField label="Bio" hint="Optional. Shown on the profile page.">
              <Textarea
                value={bio ?? ""}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </FormField>
            <FormField label="Avatar URL" hint="Direct link to a photo. Falls back to initials.">
              <TextInput
                type="url"
                value={avatarUrl ?? ""}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold">
              Contact
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Slack handle">
                <TextInput
                  value={slack ?? ""}
                  onChange={(e) => setSlack(e.target.value)}
                  placeholder="@haseeb"
                />
              </FormField>
              <FormField label="Phone">
                <TextInput
                  type="tel"
                  value={phone ?? ""}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormField>
              <FormField label="WhatsApp" hint="Digits only, with country code.">
                <TextInput
                  value={whatsapp ?? ""}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="971501234567"
                />
              </FormField>
              <FormField label="Location">
                <TextInput
                  value={location ?? ""}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dubai HQ"
                />
              </FormField>
              <FormField label="Working hours" className="sm:col-span-2">
                <TextInput
                  value={hours ?? ""}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Sun–Thu · 09:00–18:00 GST"
                />
              </FormField>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Department">
              <Select
                value={deptId ?? ""}
                onChange={(e) => setDeptId(e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {departmentOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Manager (reports to)">
              <Select
                value={reportsTo ?? ""}
                onChange={(e) => setReportsTo(e.target.value)}
              >
                <option value="">— None —</option>
                {managers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
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
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-nexa-purple cursor-pointer"
              />
              <span className="text-[12.5px] text-text-1">
                Active (shown in directory)
              </span>
            </label>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between gap-2">
          <Link href="/admin/team">
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
