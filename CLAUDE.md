# CLAUDE.md — repo rules for AI assistants

Read this first. Then `SPEC.md` for product detail.

## What this is

NEXA Ops Handbook — internal authenticated web app for ~75 NEXA Digital employees. Next.js 15 + Supabase. Read-mostly; one Admin (Operations Manager) maintains all content; everyone else is read-only except for their own onboarding checklist.

## Non-negotiable rules

1. **`SPEC.md` is the source of truth.** Where the wireframe (`docs/reference/index.html`) and the SPEC disagree, the SPEC wins. The wireframe is for visual reference only and invents features the SPEC explicitly excludes (HRIS sync, approvals, presence, platform health).
2. **Do not deviate from the stack** in SPEC §4 without asking. No new heavy UI libraries, no swapping ORMs, no auth provider changes.
3. **Two roles only:** Admin and Member. Admin is determined by `ADMIN_EMAILS` env var; not a column to be edited via UI. Member writes are restricted to their own `onboarding_completions` rows.
4. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.** Server-only. Only the auth callback uses it (to set `is_admin` on profile creation).
5. **Plaintext credentials in `platform_logins.credential_value`** — see SPEC §6. Do not "improve" this with crypto on your own. Escalate the decision instead.
6. **Host-agnostic build.** `next.config.ts` uses `output: 'standalone'`. Do not add Vercel-specific features (image optimisation against external hosts, edge runtime requirements, etc.) without checking — the target may be Render or a self-hosted server.

## Build order

Follow SPEC §10. Earlier steps gate later ones. Do not start the dashboard before the data model is in place.

## Conventions

- **Components live under `src/components/`.** Generic primitives in `src/components/ui/`; layout in `src/components/layout/`; feature-specific in `src/components/<feature>/`.
- **Server-first.** Default to React Server Components and server actions. Use `'use client'` only when you need interactivity, browser APIs, or local state.
- **Data fetching.** Server components query Supabase directly via `src/lib/supabase/server.ts`. Avoid client-side fetching for read-heavy pages.
- **Forms.** React Hook Form + Zod. One Zod schema per entity in `src/lib/zod/`.
- **Styling.** Tailwind v4 only. Colours and spacing must come from the design tokens in `tailwind.config.ts` — do not hardcode hex values in components.
- **Path aliases.** Use `@/` instead of relative imports across `src/`.

## Database

- Migrations are SQL files in `supabase/migrations/`, applied in filename order.
- RLS is on for every table. Authenticated SELECT is the baseline; INSERT/UPDATE/DELETE require `is_admin`. Exception: `onboarding_completions` allows the user themselves.
- Generated types live at `src/lib/types/database.ts`. Regenerate with `npm run db:types` after schema changes.

## What's deferred to Phase 2 (out of scope for v1)

See SPEC §2 "Out of scope". Do not build HRIS integration, Slack presence, Google Calendar, approval queues, platform health dashboards, encrypted vault, department-scoped dashboards, video upload.

## When something is missing

- Supabase project, OAuth client, or admin email not yet provided → write the code that consumes them via env vars and stub locally; do not invent placeholder credentials.
- If you are unsure whether to add a feature, re-read SPEC §2 first. If still unsure, leave a TODO with a comment block explaining the trade-off and stop.

## When deviating from SPEC

SPEC §14 requires deviations to be reflected back in `SPEC.md`. Update the spec in the same PR as the deviation.
