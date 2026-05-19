-- ─────────────────────────────────────────────────────────────────────────────
-- NEXA Ops Handbook — Row-Level Security
-- Policy:
--   • Every table requires an authenticated session to read.
--   • INSERT / UPDATE / DELETE require profiles.is_admin = true.
--   • Exception: onboarding_completions — a user can write rows where
--     user_id = auth.uid().
--   • Exception: profiles — service role (auth callback) manages writes;
--     users can read all profiles, update only their own non-admin fields.
-- ─────────────────────────────────────────────────────────────────────────────

-- Helper: is the calling user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Enable RLS on every table.
alter table public.profiles               enable row level security;
alter table public.departments            enable row level security;
alter table public.team_members           enable row level security;
alter table public.sops                   enable row level security;
alter table public.documents              enable row level security;
alter table public.platform_logins        enable row level security;
alter table public.internal_tools         enable row level security;
alter table public.announcements          enable row level security;
alter table public.message_templates      enable row level security;
alter table public.onboarding_steps       enable row level security;
alter table public.onboarding_completions enable row level security;
alter table public.comms_standards        enable row level security;

-- ── profiles ────────────────────────────────────────────────────────────────
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated using (true);

create policy "profiles_update_self"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and is_admin = (select is_admin from public.profiles where id = auth.uid()));

-- ── Helper macro: standard "read-for-everyone, write-for-admin" policies ────
-- (Postgres has no macro; we just repeat the pattern.)

-- departments
create policy "departments_select" on public.departments
  for select to authenticated using (true);
create policy "departments_admin_write" on public.departments
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- team_members
create policy "team_members_select" on public.team_members
  for select to authenticated using (true);
create policy "team_members_admin_write" on public.team_members
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- sops
create policy "sops_select" on public.sops
  for select to authenticated using (true);
create policy "sops_admin_write" on public.sops
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- documents
create policy "documents_select" on public.documents
  for select to authenticated using (true);
create policy "documents_admin_write" on public.documents
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- platform_logins
create policy "platform_logins_select" on public.platform_logins
  for select to authenticated using (true);
create policy "platform_logins_admin_write" on public.platform_logins
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- internal_tools
create policy "internal_tools_select" on public.internal_tools
  for select to authenticated using (true);
create policy "internal_tools_admin_write" on public.internal_tools
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- announcements
create policy "announcements_select" on public.announcements
  for select to authenticated using (true);
create policy "announcements_admin_write" on public.announcements
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- message_templates: admin writes for all columns EXCEPT usage_count, which
-- any authenticated user can increment via a SECURITY DEFINER RPC. The simple
-- policy here only covers admin writes; the increment helper is below.
create policy "message_templates_select" on public.message_templates
  for select to authenticated using (true);
create policy "message_templates_admin_write" on public.message_templates
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create or replace function public.increment_template_usage(template_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.message_templates
     set usage_count = usage_count + 1
   where id = template_id;
$$;
revoke all on function public.increment_template_usage(uuid) from public;
grant execute on function public.increment_template_usage(uuid) to authenticated;

-- onboarding_steps
create policy "onboarding_steps_select" on public.onboarding_steps
  for select to authenticated using (true);
create policy "onboarding_steps_admin_write" on public.onboarding_steps
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- onboarding_completions: users manage their own.
create policy "onboarding_completions_select_self" on public.onboarding_completions
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "onboarding_completions_insert_self" on public.onboarding_completions
  for insert to authenticated with check (user_id = auth.uid());
create policy "onboarding_completions_delete_self" on public.onboarding_completions
  for delete to authenticated using (user_id = auth.uid());

-- comms_standards
create policy "comms_standards_select" on public.comms_standards
  for select to authenticated using (true);
create policy "comms_standards_admin_write" on public.comms_standards
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
