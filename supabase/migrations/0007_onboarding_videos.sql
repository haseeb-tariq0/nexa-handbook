-- ─────────────────────────────────────────────────────────────────────────────
-- onboarding_videos
-- Embedded videos (YouTube / Vimeo / external hosts) shown on the Onboarding
-- page. Video UPLOAD is out of scope per SPEC §2 — this stores URLs only.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.onboarding_videos (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  video_url       text not null,
  thumbnail_url   text,
  duration_label  text,            -- "5:32" — free-text, not parsed
  sort_order      int not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index onboarding_videos_sort_idx on public.onboarding_videos (sort_order);
create index onboarding_videos_active_idx on public.onboarding_videos (is_active);

create trigger onboarding_videos_updated_at before update on public.onboarding_videos
  for each row execute function public.set_updated_at();

-- RLS — baseline auth SELECT, admin-only writes (mirrors other tables)
alter table public.onboarding_videos enable row level security;

create policy "onboarding_videos_select_authenticated"
  on public.onboarding_videos
  for select
  to authenticated
  using (true);

create policy "onboarding_videos_admin_insert"
  on public.onboarding_videos
  for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "onboarding_videos_admin_update"
  on public.onboarding_videos
  for update
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

create policy "onboarding_videos_admin_delete"
  on public.onboarding_videos
  for delete
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- Seed three sample videos (mirror the wireframe).
insert into public.onboarding_videos
  (title, description, video_url, thumbnail_url, duration_label, sort_order)
values
  (
    'Welcome to NEXA — Ops Walkthrough',
    'Operations Team · Added Mar 2026',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    null,
    '5:32',
    10
  ),
  (
    'Google Drive & File Management',
    'Operations Team · Added Jan 2026',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    null,
    '8:14',
    20
  ),
  (
    'HubSpot CRM — Getting Started',
    'HubSpot Team · Added Feb 2026',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    null,
    '6:45',
    30
  );
