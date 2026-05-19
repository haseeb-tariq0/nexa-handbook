-- Address Supabase security advisor warnings:
--   1. set_updated_at had a mutable search_path → pin it
--   2. is_admin() and increment_template_usage() exposed to anon role → revoke
--
-- Remaining warnings on these functions (callable by authenticated) are
-- INTENTIONAL — that's their purpose. is_admin() is used inside RLS policies
-- and returns only the calling user's flag. increment_template_usage() lets
-- authenticated users bump usage_count without granting UPDATE on the row.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.is_admin() from anon;
revoke execute on function public.increment_template_usage(uuid) from anon;
