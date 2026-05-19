# SETUP — NEXA Ops Handbook

Phase 1 scaffold is in place. To bring it to life you need to (1) install deps,
(2) provision a Supabase project + Google OAuth client, (3) drop credentials
into `.env.local`. Estimated total time: ~30 minutes.

## 1. Install

```powershell
# from D:\handbook
npm install
```

## 2. Supabase project

Already provisioned: **nexa handbook** (`rzsoflcgxmensnwnrucb`) in
`ap-northeast-1` (Tokyo), under the NEXA org. All four migrations are
applied — schema, RLS, seed data, and security fixes.

You only need the service-role key from the dashboard (see step 4).

Region note: Tokyo is suboptimal for Dubai-based users (~120 ms RTT vs ~30
ms from Mumbai). Reasonable for an internal read-mostly app, but consider
recreating in `ap-south-1` later if latency feels off. Not blocking.

## 3. Google OAuth (Workspace SSO)

Only a `digitalnexa.com` Workspace admin can create this client.

1. Go to https://console.cloud.google.com → APIs & Services → Credentials.
2. Create an OAuth 2.0 Client ID, type **Web application**.
3. Authorised redirect URIs:
   - `http://localhost:54321/auth/v1/callback` (local Supabase)
   - `https://<your-project-ref>.supabase.co/auth/v1/callback` (hosted Supabase)
4. In Supabase Dashboard → **Authentication → Providers → Google**, paste the
   Client ID and Secret.
5. Enable the provider. Save.

The OAuth `hd=digitalnexa.com` parameter is set client-side at sign-in
(`src/app/login/page.tsx`), and the server-side callback double-checks the
email domain. Defence in depth.

## 4. Create `.env.local`

Copy `.env.example` to `.env.local`. The Supabase URL + publishable key are
already known — paste these in:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://rzsoflcgxmensnwnrucb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_giyJIDATCxAEQYoxZwm_aA_52o1Ljdz
SUPABASE_SERVICE_ROLE_KEY=        # from Dashboard → Settings → API → service_role
ADMIN_EMAILS=haseeb.t@digitalnexa.com,murtaza@digitalnexa.com
GOOGLE_WORKSPACE_DOMAIN=digitalnexa.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The `service_role` secret key is only visible in the Supabase Dashboard
(not exposable via API). Grab it from
https://supabase.com/dashboard/project/rzsoflcgxmensnwnrucb/settings/api
under **Project API keys → service_role**.

**`SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser.** Only the
auth callback (`src/app/auth/callback/route.ts`) and any future server-side
admin actions use it.

## 5. Database types

Already generated and committed at `src/lib/types/database.ts` against the
deployed schema. Regenerate after schema changes:

```powershell
npm run db:types        # requires `supabase link --project-ref rzsoflcgxmensnwnrucb` first
```

## 6. Run the dev server

```powershell
npm run dev
```

Open http://localhost:3000. You'll be redirected to `/login`. Sign in with a
`@digitalnexa.com` account that's listed in `ADMIN_EMAILS` to see the Admin
sidebar entry (added in a later phase).

## What's wired so far (Phase 1)

- Project scaffold: Next.js 15, TypeScript, Tailwind v4, host-agnostic build
  (`output: 'standalone'`).
- Design tokens ported from the wireframe into `src/styles/tokens.css` and
  `tailwind.config.ts`.
- Full database schema (12 tables, RLS, seed data) in `supabase/migrations/`.
- Supabase clients (browser, server, service-role).
- Auth: Google OAuth via Supabase, `digitalnexa.com` enforced both client-side
  (`hd` param) and server-side (callback domain check); `ADMIN_EMAILS` → profile
  `is_admin` on first sign-in.
- Route protection middleware: unauthenticated → `/login`; non-admin → `/admin/*`
  returns 404.
- App shell: sidebar (5 nav groups with active-state accent bar, admin section
  shown only to admins), top bar (search slot + notifications + avatar
  initials), Home placeholder.

## What's NOT wired yet (Phase 2+)

- Section pages with real data (Team, Departments, Documents, Platform Logins,
  SOPs, Internal Comms, NEXA Tools, Onboarding).
- Command palette (⌘K).
- Onboarding checklist server actions.
- Admin CRUD area.
- Empty states, loading skeletons, mobile drawer.

Build order follows SPEC §10. Don't skip ahead.

## Decisions logged so far

- **Hosting**: host-agnostic via `output: 'standalone'`. Targets Render or a
  self-hosted server. Override SPEC §4 (which said Vercel).
- **`/settings`** in the wireframe → folded into `/profile`. SPEC §7 had no
  Settings route, so no deviation from SPEC.
- **`output: 'standalone'`** means `next start` is replaced by
  `node .next/standalone/server.js` in production.
- **Service-role auth callback** chosen over Supabase auth hooks because hooks
  require enterprise tier on hosted Supabase.

## Open items needing your input

1. **Supabase project**: create it (or share the credentials if you already
   have one from a previous attempt).
2. **Google OAuth client**: needs a `digitalnexa.com` Workspace admin.
3. **Admin emails**: `haseeb.t@digitalnexa.com` (build admin, you) and
   `murtaza@digitalnexa.com` (production Operations Manager per SPEC §3) are
   set in `.env.example`. Add more comma-separated if needed.
4. **Subdomain choice**: `handbook.digitalnexa.com`? `ops.digitalnexa.com`?
   Not blocking until deploy.
