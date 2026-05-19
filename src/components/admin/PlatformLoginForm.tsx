"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, ShieldAlert } from "lucide-react";
import {
  FormField,
  TextInput,
  Textarea,
  Select,
} from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <TextInput
        type={shown ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono pr-9"
        autoComplete="off"
        placeholder='Sign in with Google, or paste password here'
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-7 w-7 rounded text-text-3 hover:text-text-1 hover:bg-panel-2 transition"
        aria-label={shown ? "Hide" : "Show"}
      >
        {shown ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

const CATEGORIES = [
  { value: "design", label: "Design" },
  { value: "production", label: "Production" },
  { value: "web", label: "Web" },
  { value: "sales_am", label: "Sales & Account Mgmt" },
  { value: "seo", label: "SEO" },
  { value: "content", label: "Content" },
  { value: "performance", label: "Performance" },
  { value: "social", label: "Social Media" },
  { value: "everyone", label: "Everyone" },
  { value: "ai_labs", label: "AI Labs" },
] as const;

type Option = { id: string; label: string };

export type PlatformLoginInitial = {
  id?: string;
  tool_name?: string;
  tool_url?: string | null;
  description?: string | null;
  category?: typeof CATEGORIES[number]["value"];
  login_identifier?: string | null;
  credential_value?: string | null;
  price?: string | null;
  valid_until?: string | null;
  access_notes?: string | null;
  managed_by_id?: string | null;
};

function dateInputValue(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function PlatformLoginForm({
  initial,
  ownerOptions,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: PlatformLoginInitial;
  ownerOptions: Option[];
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.tool_name ?? "");
  const [url, setUrl] = useState(initial?.tool_url ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "everyone");
  const [loginId, setLoginId] = useState(initial?.login_identifier ?? "");
  const [credential, setCredential] = useState(initial?.credential_value ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [validUntil, setValidUntil] = useState(
    dateInputValue(initial?.valid_until),
  );
  const [notes, setNotes] = useState(initial?.access_notes ?? "");
  const [managerId, setManagerId] = useState(initial?.managed_by_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("tool_name", name);
    fd.set("tool_url", url);
    fd.set("description", description);
    fd.set("category", category);
    fd.set("login_identifier", loginId);
    fd.set("credential_value", credential);
    fd.set("price", price);
    fd.set("valid_until", validUntil);
    fd.set("access_notes", notes);
    fd.set("managed_by_id", managerId);
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/platform-logins");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Tool name" required>
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Figma"
                required
              />
            </FormField>
            <FormField label="URL">
              <TextInput
                type="url"
                value={url ?? ""}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://figma.com"
              />
            </FormField>
            <FormField
              label="Description"
              hint="One sentence — what is this tool used for?"
            >
              <Textarea
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-start gap-2.5 px-3 py-2 bg-status-amber-bg border border-status-amber/30 text-status-amber rounded text-[11px]">
              <ShieldAlert className="h-3 w-3 shrink-0 mt-0.5" />
              <span>
                Credentials are stored as plaintext in the database (per SPEC §6).
                Never use this for TOTP secrets or recovery codes.
              </span>
            </div>
            <FormField
              label="Login identifier"
              hint='Email/username used to sign in, or a label like "Google SSO".'
            >
              <TextInput
                value={loginId ?? ""}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="design@digitalnexa.com"
              />
            </FormField>
            <FormField
              label="Password"
              hint='The actual password, or a note like "Sign in with Google", "Ask Nikhil for 2FA". Updated here, visible on /platform-logins immediately.'
            >
              <PasswordInput
                value={credential ?? ""}
                onChange={setCredential}
              />
            </FormField>
            <FormField
              label="Access notes"
              hint="Who can use it, restrictions, etc."
            >
              <Textarea
                value={notes ?? ""}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="All designers"
              />
            </FormField>
          </CardBody>
        </Card>
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
            <FormField
              label="Price"
              hint='Free text — e.g. "$29/month", "AED 1,335/mo".'
            >
              <TextInput
                value={price ?? ""}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$45/editor/mo"
              />
            </FormField>
            <FormField label="Valid until">
              <TextInput
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </FormField>
            <FormField label="Managed by">
              <Select
                value={managerId ?? ""}
                onChange={(e) => setManagerId(e.target.value)}
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
          <Link href="/admin/platform-logins">
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
