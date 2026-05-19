-- ─────────────────────────────────────────────────────────────────────────────
-- NEXA Ops Handbook — initial schema
-- See SPEC.md §5 for the data model rationale.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles — auth identity. Auto-created on first login.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  full_name   text,
  avatar_url  text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- departments
-- ─────────────────────────────────────────────────────────────────────────────
create table public.departments (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text not null unique,
  lead_id         uuid,                       -- FK added after team_members exists
  description     text,
  core_expertise  text[] not null default '{}',
  key_tools       text[] not null default '{}',
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index departments_sort_idx on public.departments (sort_order);
create trigger departments_updated_at before update on public.departments
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- team_members — editorial directory. Separate from profiles.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.team_members (
  id             uuid primary key default gen_random_uuid(),
  email          text not null,
  full_name      text not null,
  role_title     text not null,
  department_id  uuid references public.departments (id) on delete set null,
  slack_handle   text,
  phone          text,
  whatsapp       text,
  working_hours  text,
  location       text,
  reports_to     uuid references public.team_members (id) on delete set null,
  bio            text,
  avatar_url     text,
  is_active      boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index team_members_department_idx on public.team_members (department_id);
create index team_members_active_idx on public.team_members (is_active);
create trigger team_members_updated_at before update on public.team_members
  for each row execute function public.set_updated_at();

alter table public.departments
  add constraint departments_lead_fkey
  foreign key (lead_id) references public.team_members (id) on delete set null;

-- ─────────────────────────────────────────────────────────────────────────────
-- sops
-- ─────────────────────────────────────────────────────────────────────────────
create table public.sops (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  summary           text,
  body              text,                      -- markdown
  department_id     uuid references public.departments (id) on delete set null,
  owner_id          uuid references public.team_members (id) on delete set null,
  external_link     text,
  last_reviewed_at  timestamptz,
  is_published      boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index sops_department_idx on public.sops (department_id);
create index sops_published_idx on public.sops (is_published);
create index sops_updated_idx on public.sops (updated_at desc);
create trigger sops_updated_at before update on public.sops
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- documents
-- ─────────────────────────────────────────────────────────────────────────────
create type public.document_category as enum (
  'brand', 'templates', 'policies', 'onboarding',
  'hr', 'finance', 'operations', 'creative', 'ai_tech'
);
create type public.document_file_type as enum (
  'pdf', 'docx', 'pptx', 'gdoc', 'gsheet', 'link', 'video'
);

create table public.documents (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  category      public.document_category not null,
  external_url  text not null,
  file_type     public.document_file_type,
  owner_id      uuid references public.team_members (id) on delete set null,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index documents_category_idx on public.documents (category);
create index documents_updated_idx on public.documents (updated_at desc);
create trigger documents_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- platform_logins
-- ─────────────────────────────────────────────────────────────────────────────
create type public.platform_category as enum (
  'design', 'production', 'web', 'sales_am', 'seo',
  'content', 'performance', 'social', 'everyone', 'ai_labs'
);

create table public.platform_logins (
  id                uuid primary key default gen_random_uuid(),
  tool_name         text not null,
  tool_url          text,
  description       text,
  category          public.platform_category not null,
  login_identifier  text,
  credential_value  text,           -- plaintext per SPEC §6. Authenticated-only via RLS.
  price             text,
  valid_until       date,
  access_notes      text,
  managed_by_id     uuid references public.team_members (id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index platform_logins_category_idx on public.platform_logins (category);
create index platform_logins_updated_idx on public.platform_logins (updated_at desc);
create trigger platform_logins_updated_at before update on public.platform_logins
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- internal_tools — the NEXA Tools launchpad cards.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.internal_tools (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  url           text not null,
  description   text,
  icon_emoji    text,
  accent_color  text,
  is_live       boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger internal_tools_updated_at before update on public.internal_tools
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- announcements
-- ─────────────────────────────────────────────────────────────────────────────
create type public.announcement_category as enum (
  'new', 'reminder', 'access', 'ops', 'tools', 'team'
);

create table public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null,
  category      public.announcement_category not null,
  posted_by_id  uuid references public.team_members (id) on delete set null,
  published_at  timestamptz not null default now(),
  is_pinned     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index announcements_published_idx on public.announcements (published_at desc);
create trigger announcements_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- message_templates
-- ─────────────────────────────────────────────────────────────────────────────
create type public.template_category as enum (
  'client_facing', 'internal', 'announcement', 'hr', 'meeting', 'escalation'
);

create table public.message_templates (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  body         text not null,
  category     public.template_category not null,
  usage_count  int not null default 0,
  owner_id     uuid references public.team_members (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index message_templates_category_idx on public.message_templates (category);
create trigger message_templates_updated_at before update on public.message_templates
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- onboarding_steps + onboarding_completions
-- ─────────────────────────────────────────────────────────────────────────────
create table public.onboarding_steps (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  day_label       text not null,
  linked_section  text,
  external_url    text,
  sort_order      int not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index onboarding_steps_sort_idx on public.onboarding_steps (sort_order);
create trigger onboarding_steps_updated_at before update on public.onboarding_steps
  for each row execute function public.set_updated_at();

create table public.onboarding_completions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  step_id       uuid not null references public.onboarding_steps (id) on delete cascade,
  completed_at  timestamptz not null default now(),
  unique (user_id, step_id)
);
create index onboarding_completions_user_idx on public.onboarding_completions (user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- comms_standards — flexible reference content for the Internal Comms section.
-- ─────────────────────────────────────────────────────────────────────────────
create type public.comms_kind as enum (
  'channel', 'response_standard', 'meeting_do', 'meeting_dont',
  'meeting_decision', 'escalation_path'
);

create table public.comms_standards (
  id          uuid primary key default gen_random_uuid(),
  kind        public.comms_kind not null,
  title       text not null,
  body        text,
  meta        jsonb not null default '{}'::jsonb,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index comms_standards_kind_idx on public.comms_standards (kind);
create trigger comms_standards_updated_at before update on public.comms_standards
  for each row execute function public.set_updated_at();
