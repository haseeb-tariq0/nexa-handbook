-- Make intended_admin a real tri-state:
--   NULL  = unset, falls back to ADMIN_EMAILS env var on first sign-in
--   true  = explicit override: this user will be Admin
--   false = explicit override: this user will be Member (even if in ADMIN_EMAILS)
alter table public.team_members alter column intended_admin drop not null;
alter table public.team_members alter column intended_admin set default null;

-- Reset existing default-false rows back to NULL so the env var still seeds them.
update public.team_members set intended_admin = null where intended_admin = false;

comment on column public.team_members.intended_admin is
  'NULL = use ADMIN_EMAILS env var on first sign-in. true/false = explicit override set via /admin/users UI.';
