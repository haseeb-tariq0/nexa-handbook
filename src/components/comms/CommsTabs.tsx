"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Hash,
  Clock,
  Calendar,
  ArrowUpFromLine,
  Megaphone,
  AlertCircle,
  Plus,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { TemplateCard } from "@/components/comms/TemplateCard";
import { cn } from "@/lib/utils";
import { TEMPLATE_CATEGORY_LABELS } from "@/lib/constants";
import type {
  MessageTemplateListItem,
  CommsStandardItem,
  AnnouncementArchiveItem,
} from "@/lib/queries/comms";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CommsTabs({
  templates,
  standards,
  announcements,
  isAdmin = false,
}: {
  templates: MessageTemplateListItem[];
  standards: CommsStandardItem[];
  announcements: AnnouncementArchiveItem[];
  isAdmin?: boolean;
}) {
  const [templateCat, setTemplateCat] = useState<string | null>(null);
  const [templateQuery, setTemplateQuery] = useState("");
  const [announcementQuery, setAnnouncementQuery] = useState("");

  const channels = standards.filter((s) => s.kind === "channel");
  const responses = standards.filter((s) => s.kind === "response_standard");
  const meetingDos = standards.filter((s) => s.kind === "meeting_do");
  const meetingDonts = standards.filter((s) => s.kind === "meeting_dont");
  const decisions = standards.filter((s) => s.kind === "meeting_decision");
  const escalations = standards.filter((s) => s.kind === "escalation_path");

  const templateCategories = Object.entries(TEMPLATE_CATEGORY_LABELS).filter(
    ([key]) => templates.some((t) => t.category === key),
  );

  const filteredTemplates = useMemo(() => {
    const needle = templateQuery.trim().toLowerCase();
    return templates.filter((t) => {
      if (templateCat && t.category !== templateCat) return false;
      if (!needle) return true;
      return (
        t.title.toLowerCase().includes(needle) ||
        t.description?.toLowerCase().includes(needle) ||
        t.body.toLowerCase().includes(needle)
      );
    });
  }, [templates, templateCat, templateQuery]);

  const filteredAnnouncements = useMemo(() => {
    const needle = announcementQuery.trim().toLowerCase();
    if (!needle) return announcements;
    return announcements.filter(
      (a) =>
        a.title.toLowerCase().includes(needle) ||
        a.body.toLowerCase().includes(needle),
    );
  }, [announcements, announcementQuery]);

  return (
    <div className="space-y-8">
      {/* Message templates */}
      <section>
        <div className="bg-panel border border-border rounded-md p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-[15px] font-semibold text-text-1">
                Message templates
              </div>
              <div className="text-[11.5px] text-text-3 mt-0.5">
                Pre-approved copy for the most common comms scenarios
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-4 pointer-events-none" />
                <input
                  type="text"
                  value={templateQuery}
                  onChange={(e) => setTemplateQuery(e.target.value)}
                  placeholder="Search templates…"
                  className="w-[240px] pl-9 pr-3 py-2 text-[12.5px] bg-panel-2 border border-border rounded-md outline-none focus:border-nexa-purple focus:bg-panel transition"
                />
              </div>
              {isAdmin && (
                <Link
                  href="/admin/templates/new"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-text-1 text-white text-[12px] font-medium hover:bg-nexa-purple transition"
                >
                  <Plus className="h-3 w-3" />
                  New template
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            <FilterPill
              active={templateCat === null}
              onClick={() => setTemplateCat(null)}
            >
              All <span className="text-text-4 ml-1">{templates.length}</span>
            </FilterPill>
            {templateCategories.map(([key, label]) => {
              const count = templates.filter((t) => t.category === key).length;
              return (
                <FilterPill
                  key={key}
                  active={templateCat === key}
                  onClick={() => setTemplateCat(key)}
                >
                  {label}
                  <span
                    className={cn(
                      "ml-1",
                      templateCat === key ? "text-white/70" : "text-text-4",
                    )}
                  >
                    {count}
                  </span>
                </FilterPill>
              );
            })}
          </div>

          {filteredTemplates.length === 0 ? (
            <p className="text-[12.5px] text-text-3 py-8 text-center bg-panel-2 border border-dashed border-border rounded-md">
              No templates match.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTemplates.map((t) => (
                <div key={t.id} className="relative group">
                  {isAdmin && (
                    <Link
                      href={`/admin/templates/${t.id}`}
                      className="absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center h-6 w-6 rounded text-text-4 hover:text-nexa-purple hover:bg-nexa-purple-tint transition opacity-0 group-hover:opacity-100"
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Pencil className="h-3 w-3" />
                    </Link>
                  )}
                  <TemplateCard tpl={t} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Channels + Response standards (2-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {channels.length > 0 && (
          <section>
            <SectionHeader
              title="Slack channel guide"
              subtitle="What goes where · who owns it · how busy it is"
              count={channels.length}
              countSuffix="channels"
            />
            <div className="space-y-2">
              {channels.map((c) => {
                const meta = (c.meta ?? {}) as {
                  owner?: string;
                  response?: string;
                };
                return (
                  <Card key={c.id}>
                    <CardBody className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="h-8 w-8 rounded-md bg-section-comms/10 text-section-comms inline-flex items-center justify-center shrink-0 mt-0.5">
                          <Hash className="h-3.5 w-3.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-semibold text-text-1 font-mono">
                            {c.title}
                          </div>
                          {c.body && (
                            <p className="text-[11.5px] text-text-3 mt-0.5 leading-snug">
                              {c.body}
                            </p>
                          )}
                          {(meta.owner || meta.response) && (
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-text-3">
                              {meta.owner && (
                                <span>
                                  <span className="text-text-4 uppercase tracking-wider mr-1">
                                    Owner
                                  </span>
                                  {meta.owner}
                                </span>
                              )}
                              {meta.response && (
                                <span>
                                  <span className="text-text-4 uppercase tracking-wider mr-1">
                                    Response
                                  </span>
                                  {meta.response}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {responses.length > 0 && (
          <section>
            <SectionHeader
              title="Response standards"
              subtitle="How fast people should reply, by channel"
              count={responses.length}
            />
            <Card>
              <CardBody className="p-0">
                <div className="divide-y divide-border">
                  {responses.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start gap-3 px-5 py-3.5"
                    >
                      <span className="h-8 w-8 rounded-md bg-panel-2 text-text-3 inline-flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1">
                        <div className="text-[12.5px] font-semibold text-text-1">
                          {r.title}
                        </div>
                        {r.body && (
                          <div className="text-[11px] text-text-3 mt-0.5 leading-snug">
                            {r.body}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </section>
        )}
      </div>

      {/* Meeting standards */}
      {(meetingDos.length > 0 ||
        meetingDonts.length > 0 ||
        decisions.length > 0) && (
        <section>
          <SectionHeader
            title="Meeting standards"
            subtitle="When to meet, when not, and how to run a meeting at NEXA"
          />
          {(meetingDos.length > 0 || meetingDonts.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {meetingDos.length > 0 && (
                <Card>
                  <CardBody>
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-status-green font-semibold mb-3 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Do
                    </div>
                    <div className="space-y-3">
                      {meetingDos.map((d) => (
                        <div key={d.id}>
                          <div className="text-[12.5px] font-semibold text-text-1">
                            {d.title}
                          </div>
                          {d.body && (
                            <p className="text-[11.5px] text-text-3 mt-0.5 leading-relaxed">
                              {d.body}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
              {meetingDonts.length > 0 && (
                <Card>
                  <CardBody>
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-status-rose font-semibold mb-3 flex items-center gap-1.5">
                      <AlertCircle className="h-3 w-3" />
                      Don&rsquo;t
                    </div>
                    <div className="space-y-3">
                      {meetingDonts.map((d) => (
                        <div key={d.id}>
                          <div className="text-[12.5px] font-semibold text-text-1">
                            {d.title}
                          </div>
                          {d.body && (
                            <p className="text-[11.5px] text-text-3 mt-0.5 leading-relaxed">
                              {d.body}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          )}
          {decisions.length > 0 && (
            <Card>
              <CardBody>
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-4 font-semibold mb-4">
                  Meeting or message?
                </div>
                <div className="space-y-2">
                  {decisions.map((d) => {
                    const meta = (d.meta ?? {}) as { meeting?: boolean };
                    return (
                      <div
                        key={d.id}
                        className="grid grid-cols-[1fr_140px] items-start gap-4 py-2 border-b border-border last:border-b-0"
                      >
                        <div>
                          <div className="text-[12.5px] font-medium text-text-1">
                            {d.title}
                          </div>
                          {d.body && (
                            <div className="text-[11px] text-text-3 mt-0.5">
                              {d.body}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant={meta.meeting ? "purple" : "default"}
                          className="self-start"
                        >
                          {meta.meeting ? "Meeting" : "Message"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          )}
        </section>
      )}

      {/* Escalation paths */}
      {escalations.length > 0 && (
        <section>
          <SectionHeader
            title="Escalation paths"
            subtitle="For each issue type, who to contact in order"
            count={escalations.length}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {escalations.map((e) => {
              const meta = (e.meta ?? {}) as { steps?: string[] };
              return (
                <Card key={e.id}>
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 rounded-md bg-status-rose-bg text-status-rose inline-flex items-center justify-center shrink-0">
                        <ArrowUpFromLine className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-text-1">
                          {e.title}
                        </div>
                        {e.body && (
                          <p className="text-[11.5px] text-text-3 mt-1 leading-relaxed">
                            {e.body}
                          </p>
                        )}
                        {meta.steps && meta.steps.length > 0 && (
                          <ol className="mt-3 flex flex-wrap items-center gap-1.5">
                            {meta.steps.map((step, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-panel-2 text-text-2 text-[10.5px] font-medium">
                                  <span className="text-text-4">{i + 1}.</span>
                                  {step}
                                </span>
                                {i < meta.steps!.length - 1 && (
                                  <span className="text-text-4">→</span>
                                )}
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements archive */}
      <section id="announcements">
        <SectionHeader
          title="Announcements archive"
          subtitle="Every company-wide announcement that has appeared in the ticker"
          count={announcements.length}
        />
        <div className="mb-3">
          <div className="relative max-w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-4 pointer-events-none" />
            <input
              type="text"
              value={announcementQuery}
              onChange={(e) => setAnnouncementQuery(e.target.value)}
              placeholder="Search announcements…"
              className="w-full pl-9 pr-3 py-2 text-[12.5px] bg-panel-2 border border-border rounded-md outline-none focus:border-nexa-purple focus:bg-panel transition"
            />
          </div>
        </div>
        <Card>
          <CardBody className="p-0">
            <div className="divide-y divide-border">
              {filteredAnnouncements.length === 0 ? (
                <p className="text-[12px] text-text-3 text-center py-10">
                  No announcements match.
                </p>
              ) : (
                filteredAnnouncements.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="h-8 w-8 rounded-md bg-section-comms/10 text-section-comms inline-flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="h-3.5 w-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="text-[13px] font-semibold text-text-1">
                          {a.title}
                        </h3>
                        {a.is_pinned && <Badge variant="amber">Pinned</Badge>}
                        <Badge variant="default">{a.category}</Badge>
                      </div>
                      <p className="text-[12px] text-text-3 mt-0.5 leading-relaxed">
                        {a.body}
                      </p>
                      <div className="mt-1.5 text-[10.5px] text-text-4">
                        {formatDate(a.published_at)}
                        {a.posted_by && ` · ${a.posted_by.full_name}`}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  count,
  countSuffix,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  countSuffix?: string;
}) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <div>
        <div className="text-[15px] font-semibold text-text-1">{title}</div>
        {subtitle && (
          <div className="text-[11.5px] text-text-3 mt-0.5">{subtitle}</div>
        )}
      </div>
      {count !== undefined && (
        <span className="text-[10.5px] text-text-3 bg-panel-2 border border-border px-2 py-0.5 rounded-full">
          {count} {countSuffix ?? ""}
        </span>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-[11.5px] font-medium rounded-full border transition whitespace-nowrap inline-flex items-center",
        active
          ? "bg-text-1 text-white border-text-1"
          : "bg-panel text-text-2 border-border hover:border-border-3 hover:text-text-1",
      )}
    >
      {children}
    </button>
  );
}
