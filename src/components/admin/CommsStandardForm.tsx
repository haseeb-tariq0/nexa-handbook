"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X } from "lucide-react";
import {
  FormField,
  TextInput,
  Textarea,
  Select,
} from "@/components/ui/FormField";
import { TagInput } from "@/components/ui/TagInput";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

const KINDS = [
  { value: "channel", label: "Channel" },
  { value: "response_standard", label: "Response standard" },
  { value: "meeting_do", label: "Meeting standard — Do" },
  { value: "meeting_dont", label: "Meeting standard — Don't" },
  { value: "meeting_decision", label: "Meeting decision tree row" },
  { value: "escalation_path", label: "Escalation path" },
] as const;

type Kind = typeof KINDS[number]["value"];

export type CommsStandardInitial = {
  id?: string;
  kind?: Kind;
  title?: string;
  body?: string | null;
  meta?: Record<string, unknown>;
  sort_order?: number;
};

export function CommsStandardForm({
  initial,
  onSubmit,
  submitLabel = "Save",
}: {
  initial?: CommsStandardInitial;
  onSubmit: (fd: FormData) => Promise<{ ok: boolean; error?: string }>;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>(initial?.kind ?? "channel");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);

  // Kind-specific meta state
  const initialMeta = initial?.meta ?? {};
  const [channelOwner, setChannelOwner] = useState(
    String(initialMeta.owner ?? ""),
  );
  const [channelResponse, setChannelResponse] = useState(
    String(initialMeta.response ?? ""),
  );
  const [decisionMeeting, setDecisionMeeting] = useState<boolean>(
    Boolean(initialMeta.meeting ?? false),
  );
  const [escalationSteps, setEscalationSteps] = useState<string[]>(
    Array.isArray(initialMeta.steps) ? (initialMeta.steps as string[]) : [],
  );

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const computedMeta = useMemo<Record<string, unknown>>(() => {
    if (kind === "channel") {
      const m: Record<string, unknown> = {};
      if (channelOwner) m.owner = channelOwner;
      if (channelResponse) m.response = channelResponse;
      return m;
    }
    if (kind === "meeting_decision") {
      return { meeting: decisionMeeting };
    }
    if (kind === "escalation_path") {
      return { steps: escalationSteps };
    }
    return {};
  }, [
    kind,
    channelOwner,
    channelResponse,
    decisionMeeting,
    escalationSteps,
  ]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("kind", kind);
    fd.set("title", title);
    fd.set("body", body);
    fd.set("meta", JSON.stringify(computedMeta));
    fd.set("sort_order", String(sortOrder));
    startTransition(async () => {
      const res = await onSubmit(fd);
      if (!res.ok) setError(res.error ?? "Save failed");
      else {
        router.push("/admin/comms-standards");
        router.refresh();
      }
    });
  }

  const titlePlaceholders: Record<Kind, string> = {
    channel: "#general",
    response_standard: "Direct message (DM)",
    meeting_do: "Send an agenda 24 hours before",
    meeting_dont: "Schedule a recurring meeting without an end date",
    meeting_decision: "Sharing information one-way",
    escalation_path: "Project at risk of missing deadline",
  };

  const bodyHints: Record<Kind, string> = {
    channel: "What goes in this channel.",
    response_standard: "Expected time to respond.",
    meeting_do: "Why this matters — a sentence.",
    meeting_dont: "Why this is to be avoided.",
    meeting_decision:
      'What advice to give for this situation. The right column shows "Meeting" or "Message".',
    escalation_path: "How to handle it. Steps are configured below.",
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="lg:col-span-2">
        <CardBody className="space-y-4">
          <FormField label="Kind" required>
            <Select
              value={kind}
              onChange={(e) => setKind(e.target.value as Kind)}
              required
            >
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Title" required>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={titlePlaceholders[kind]}
              required
            />
          </FormField>
          <FormField label="Body" hint={bodyHints[kind]}>
            <Textarea
              value={body ?? ""}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
          </FormField>

          {/* Kind-specific extras */}
          {kind === "channel" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
              <FormField label="Channel owner">
                <TextInput
                  value={channelOwner}
                  onChange={(e) => setChannelOwner(e.target.value)}
                  placeholder="Operations Manager"
                />
              </FormField>
              <FormField label="Expected response">
                <TextInput
                  value={channelResponse}
                  onChange={(e) => setChannelResponse(e.target.value)}
                  placeholder="Same business day"
                />
              </FormField>
            </div>
          )}

          {kind === "meeting_decision" && (
            <div className="pt-3 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={decisionMeeting}
                  onChange={(e) => setDecisionMeeting(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-nexa-purple cursor-pointer"
                />
                <span className="text-[12.5px] text-text-1">
                  This is a <strong>Meeting</strong> situation (otherwise: Message)
                </span>
              </label>
            </div>
          )}

          {kind === "escalation_path" && (
            <FormField
              label="Steps"
              hint="Ordered chain of who to contact. Press Enter after each."
            >
              <TagInput
                value={escalationSteps}
                onChange={setEscalationSteps}
                placeholder="AM"
              />
            </FormField>
          )}
        </CardBody>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardBody className="space-y-4">
            <FormField label="Sort order" hint="Lower numbers appear first.">
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
          <Link href="/admin/comms-standards">
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
