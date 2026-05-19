-- Lets admins pre-set who will become Admin on first sign-in,
-- without redeploying. Falls back to ADMIN_EMAILS env var if NULL.
alter table public.team_members
  add column if not exists intended_admin boolean not null default false;

comment on column public.team_members.intended_admin is
  'When true, the auth callback sets profiles.is_admin = true on this user''s first sign-in. After that, profiles.is_admin is managed via the /admin/users UI.';
