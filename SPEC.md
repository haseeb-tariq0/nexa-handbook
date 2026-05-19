# NEXA Ops Handbook — Build Specification

> An internal authenticated web application for NEXA Digital. A single destination for SOPs, platform credentials, team contacts, internal communications, documents, and internal tools. One login, one place, one source of truth.

---

## 0. How to use this document

This is the build spec for Claude Code. The visual reference is the existing wireframe (`index.html` in this repo, also live at https://nexa-handbook.vercel.app/). The product intent is `design-spec.html` in this repo.

**Where the visual mockup and the design-spec disagree, the design-spec wins.** The visual mockup invents features (live HRIS sync, "pending review" workflows, presence indicators, platform health monitoring, approval queues) that the design-spec explicitly does not include. Build the design-spec, use the mockup only as a styling reference.

Read this whole document before writing any code. Do not start with the dashboard. Start with the data model and auth, in that order.

---

## 1. What we are building (in one paragraph)

A read-mostly internal web app for ~75 NEXA employees. Users log in with their `@digitalnexa.com` Google account and land on a Home dashboard. They navigate via a persistent left sidebar between eight sections: Home, SOPs, Platform Logins, Team Directory, Documents, NEXA Tools, Internal Comms, and Onboarding. Almost all content is published and maintained by a single role — the Operations Manager (currently Murtaza Talib). All other users are read-only, with one exception: each user can tick off their own onboarding checklist items. There are no department admins, no approval workflows, no per-user content. Transparency is a feature — everyone sees everything.

---

## 2. Hard scope boundaries

### In scope
- Google OAuth authentication, restricted to the `@digitalnexa.com` Workspace domain
- 8 sections as listed above, each rendering content from a database
- A single "Admin" role (Operations Manager) with full CRUD on all content via an admin area
- All other users are read-only across the platform
- Per-user onboarding checklist progress (the *only* user-specific state in the app)
- Announcements: Admin posts → displayed in the rotating news ticker on Home → archived in Internal Comms
- Global search across SOPs, documents, team members, tools (client-side filtering against loaded data is acceptable for v1)
- Command palette (`⌘K` / `Ctrl+K`) for quick navigation (already exists in the wireframe, port the behavior)
- Responsive layout — desktop first, but must work on tablet and mobile
- Visual design must match the existing wireframe closely

### Out of scope for v1 — do not build
- Role-based permissions beyond Admin / Everyone-else. No department admins. No HR role. No IT role.
- HRIS integration. Headcount and team data is entered manually by the Admin into the database. Do not attempt to integrate with People HR, BambooHR, or any HRIS.
- Slack integration. No presence indicators, no "online now," no posting to Slack channels.
- Google Calendar integration. The "Your day" panel from the visual mockup is not in v1.
- Approval workflows. No "pending review," no "needs your attention," no assignment system.
- Platform health monitoring with auto-rotation tracking. Admin enters expiry dates manually.
- Activity feed auto-generated from system events. Announcements are the only feed.
- Onboarding progress tracking *by other people* (managers, HR). Each user tracks only their own.
- A custom-built password vault with encryption-at-rest and audit logs. (See §6.)
- Department-scoped dashboards. The "Suggestions for future updates" section in the design-spec is explicitly Phase 2.
- Video hosting. If a Videos section exists, links point to YouTube/Vimeo/Loom — no upload-to-our-servers.
- File hosting beyond avatars/thumbnails. Documents and SOPs link out to Google Drive.

If you find yourself building any of the above to "match the mockup," stop and ask.

---

## 3. Users and roles

Two roles only:

| Role | Who | Permissions |
|---|---|---|
| **Admin** | Operations Manager (Murtaza Talib, seeded by email) | Full CRUD on every entity. Sees an "Admin" item in the sidebar leading to a management area. |
| **Member** | Everyone else with an `@digitalnexa.com` Google account | Read-only across the whole app. The only write action available is checking off items on their own onboarding checklist. |

A user's role is determined by their email matching the `ADMIN_EMAILS` environment variable (comma-separated list). This makes it trivial to add a second admin later without a code change.

There is **no** sign-up flow, no invitation system. Anyone with a Google Workspace account on the `digitalnexa.com` domain who reaches the site can sign in and instantly has a Member account auto-provisioned on first login.

---

## 4. Tech stack

Use this stack. Do not deviate without checking first.

- **Framework:** Next.js 15 (App Router), TypeScript, React 19
- **Styling:** Tailwind CSS v4. Match the existing wireframe's design tokens (colours, fonts, spacing). Fonts: Inter (UI) and Instrument Serif (display accents).
- **UI primitives:** Build with plain Tailwind + a small set of headless primitives (Radix UI or shadcn/ui) for dropdown, dialog, command palette, toast. Do not pull in a heavyweight component library.
- **Database & Auth:** Supabase (Postgres + Auth + Storage)
  - Auth: Supabase Auth with Google OAuth provider, restricted to the `digitalnexa.com` Workspace domain via hosted-domain (`hd`) parameter and a server-side allow-list check
  - DB access via `@supabase/ssr` for server components and route handlers; never expose the service-role key to the client
  - Row-Level Security (RLS) policies enforce that only Admins can write
- **Hosting:** Vercel (current deployment is already there)
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod for validation
- **Markdown rendering** (for SOP body content, document descriptions): `react-markdown` with `remark-gfm`

The wireframe is currently a single-file vanilla HTML app. **Do not try to port it line-by-line.** Use it as a visual reference. Rebuild as proper Next.js components with the data coming from Supabase.

---

## 5. Data model

Postgres schema. All tables have `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()` unless noted. Use a trigger to maintain `updated_at`.

### `profiles`
Auto-created on first login. One row per user.
- `id uuid` — references `auth.users.id`
- `email text unique not null`
- `full_name text`
- `avatar_url text`
- `is_admin boolean not null default false` — set at sign-in time based on `ADMIN_EMAILS` env var

### `team_members`
The team directory. Maintained manually by the Admin. Note: this is *separate* from `profiles` — `profiles` is auth identity, `team_members` is the editorial directory entry. They may be linked by email but don't have to be (a team member can exist before they log in).
- `email text not null`
- `full_name text not null`
- `role_title text not null` — e.g. "Senior Designer"
- `department_id uuid` — FK to `departments.id`
- `slack_handle text`
- `phone text`
- `whatsapp text`
- `working_hours text` — free text like "Sun–Thu · 09:00–18:00 GST"
- `location text` — e.g. "Dubai HQ", "Remote"
- `reports_to uuid` — self-FK to `team_members.id` (for org chart)
- `bio text`
- `is_active boolean not null default true`
- `sort_order int default 0`

### `departments`
- `name text not null` — "Creative", "Account Mgmt", etc.
- `slug text unique not null`
- `lead_id uuid` — FK to `team_members.id`
- `description text` — what the department does
- `core_expertise text[]` — array of tags
- `key_tools text[]` — names of tools, displayed as chips
- `sort_order int default 0`

### `sops`
- `title text not null`
- `slug text unique not null`
- `summary text` — one-line description shown in lists
- `body markdown text` — full procedure content (Markdown)
- `department_id uuid` — FK to `departments.id`
- `owner_id uuid` — FK to `team_members.id`
- `external_link text` — optional: if the SOP lives in a Google Doc, link to it; otherwise body is used
- `last_reviewed_at timestamptz`
- `is_published boolean not null default false`

### `documents`
- `title text not null`
- `description text`
- `category text not null` — enum-like: 'brand', 'templates', 'policies', 'onboarding', 'hr', 'finance', 'operations', 'creative', 'ai_tech'
- `external_url text not null` — link to the Google Drive / Notion / etc. source
- `file_type text` — 'pdf', 'docx', 'pptx', 'gdoc', 'gsheet', 'link'
- `owner_id uuid` — FK to `team_members.id`
- `is_published boolean not null default true`

### `platform_logins`
- `tool_name text not null`
- `tool_url text`
- `description text`
- `category text not null` — 'design', 'production', 'web', 'sales_am', 'seo', 'content', 'performance', 'social', 'everyone', 'ai_labs'
- `login_identifier text` — the email/username used to log in (or "Google SSO", "Personal logins")
- `credential_value text` — see §6 below. May be a password, or a note like "Sign in with Google", or "Ask Nikhil for 2FA"
- `price text` — free-text, e.g. "$29/month", "AED 1,335/mo"
- `valid_until date` — optional expiry
- `access_notes text` — free-form, e.g. "Sheema only", "Per project", "Use Discord login"
- `managed_by_id uuid` — FK to `team_members.id` (who owns this account at NEXA)

### `internal_tools`
The NEXA Tools section — internal products like the Pricing Calculator.
- `name text not null`
- `url text not null`
- `description text`
- `icon_emoji text` — single emoji shown on the card
- `accent_color text` — hex code for the accent
- `is_live boolean not null default true`
- `sort_order int default 0`

### `announcements`
Posted by the Admin. Displayed in the ticker on Home. Archived in Internal Comms.
- `title text not null`
- `body text not null` — short, one-sentence body
- `category text not null` — 'new', 'reminder', 'access', 'ops', 'tools', 'team'
- `posted_by_id uuid` — FK to `team_members.id`
- `published_at timestamptz not null default now()`
- `is_pinned boolean not null default false`

### `message_templates`
Internal Comms templates library.
- `title text not null`
- `description text`
- `body markdown text not null`
- `category text not null` — 'client_facing', 'internal', 'announcement', 'hr', 'meeting', 'escalation'
- `usage_count int not null default 0` — incremented when a user clicks "Use template" and copies it
- `owner_id uuid` — FK to `team_members.id`

### `onboarding_steps`
The Day-1-to-Day-5 checklist. Same list for every user. Edited by Admin, completed per-user.
- `title text not null`
- `description text`
- `day_label text not null` — "Day 1", "Day 1–2", etc.
- `linked_section text` — optional slug pointing to a section of the app, e.g. 'sops', 'team', 'documents'
- `external_url text` — optional outbound link
- `sort_order int not null`

### `onboarding_completions`
Per-user progress on the onboarding checklist. The ONLY per-user state in the app.
- `user_id uuid not null` — FK to `profiles.id`
- `step_id uuid not null` — FK to `onboarding_steps.id`
- `completed_at timestamptz not null default now()`
- unique constraint on `(user_id, step_id)`

### `comms_standards`
Generic key-value reference content for the Internal Comms section: channel guide, response standards, meeting standards, escalation paths. Modelled as a single flexible table to avoid creating four small ones.
- `kind text not null` — 'channel', 'response_standard', 'meeting_do', 'meeting_dont', 'meeting_decision', 'escalation_path'
- `title text not null`
- `body text`
- `meta jsonb` — flexible bag for kind-specific fields (e.g. channel owner, escalation steps array)
- `sort_order int default 0`

### Row-Level Security
- `SELECT` on every table: allowed for any authenticated user.
- `INSERT / UPDATE / DELETE` on every table: allowed only when `profiles.is_admin = true` for the calling user.
- Exception: `onboarding_completions` — a user can `INSERT / DELETE` rows where `user_id = auth.uid()`.

---

## 6. The credentials problem — read this carefully

The design-spec describes displaying credentials directly on tool cards. The current Google Sheet that this replaces does the same thing. The visual mockup shows "click to reveal" password masking.

**This is not a real password vault.** Building a real vault (encryption at rest with per-user keys, audit logging, TOTP storage, secure rotation) is out of scope for v1.

For v1, do this instead:

1. Store the `credential_value` field in plaintext in the Postgres database. Be honest about what this is: a slightly-better Google Sheet, accessed only by authenticated NEXA employees over HTTPS.
2. The column is *not* exposed to anonymous users — RLS requires an authenticated session.
3. Mask the value in the UI with a "Click to reveal" button. This is UX, not security.
4. Add a banner to the Platform Logins page: *"Treat this page as confidential. Do not screenshot or share externally. NEXA is moving to a managed password vault — until then, the credentials shown here are stored as plaintext in our internal database."*
5. Do **not** store TOTP secrets, recovery codes, or anything that would let someone bypass MFA. Where the existing data shows "needs 2FA code from Nikhil", display that as a note, not as a stored secret.
6. Open a follow-up issue/ticket recommending the agency adopt 1Password Teams or Bitwarden, with this section eventually becoming a metadata index (tool name, owner, expiry) that links out to the vault.

If the Admin asks for proper encryption or vault behaviour, **escalate that decision back to a human** rather than building it. Custom-built credential vaults that go wrong cause real damage.

---

## 7. Routing and pages

App Router structure (Next.js 15). Routes:

```
/                              → Home dashboard (auth required)
/login                         → Google sign-in page (only public route)
/sops                          → SOPs index with department filter + search
/sops/[slug]                   → Single SOP view
/departments                   → Departments index
/departments/[slug]            → Single department detail (team, SOPs, tools, expertise)
/team                          → Team Directory — card view + by-department view + org-chart view
/team/[id]                     → Single team member profile
/onboarding                    → The onboarding checklist (per-user progress)
/documents                     → Document library with category filters + search
/platform-logins               → Credentials section with category filters
/internal-comms                → Templates, channel guide, standards, escalation paths, announcements archive
/nexa-tools                    → Launchpad for internal NEXA products
/admin                         → Admin landing (only accessible if is_admin)
/admin/[entity]                → Admin CRUD for each entity (sops, documents, platform-logins, team, departments, announcements, templates, onboarding-steps, internal-tools, comms-standards)
/profile                       → Current user's own profile view + edit
```

Middleware: any route other than `/login` redirects to `/login` if no session. Any route under `/admin` returns a 404 (not 403 — don't reveal it exists) if `is_admin` is false.

---

## 8. UI requirements per section

### 8.1 Home dashboard
- **Sticky news ticker at top** — rotates through up to 10 most recent published announcements. Pause on hover. Click → scroll to the announcement in the Internal Comms archive.
- **What's new** — last 5 things added/updated across SOPs, documents, platform logins, team members. Driven by `updated_at` across those tables.
- **Onboarding nudge** — if the current user has incomplete onboarding steps and was created in the last 30 days, show a compact "Continue your onboarding (3/8 complete)" card linking to `/onboarding`. Hide entirely otherwise.
- **Quick access tiles** — static row of large links to SOPs / Logins / Documents / Team / Tools / Onboarding.
- **Headcount summary** — total active team members + breakdown by department, read from `team_members` joined to `departments`. This is static-ish data Admin maintains, *not* an HRIS sync.
- **Do not build:** "Pending your review," "Needs your attention," "Your day," "Online now," "Platform health" dashboards, "Onboarding pipeline." These are visual-mockup-only and explicitly out of scope.

### 8.2 SOPs
- Index page: searchable table with columns `Title`, `Department`, `Owner`, `Last Updated`. Filter by department.
- Detail page: title, summary, owner card, last reviewed date, full markdown body, "Open external version" button if `external_link` is set, related SOPs from the same department.

### 8.3 Departments
- Index page: grid of department cards with name, lead, member count, key expertise chips.
- Detail page: name, lead, description, core expertise, related SOPs, team members (grid of cards), key tools.

### 8.4 Team Directory
- Three view toggles: **Card view** (default — grid of cards), **By department** (grouped sections), **Org chart** (rendered from `reports_to` — use a simple tree layout; if `reports_to` is null, treat as root).
- Each card: avatar (initials fallback), name, role title, department, email button (mailto:), Slack handle button, optional WhatsApp button.
- Detail page: full profile, bio, contact, reports-to chain, direct reports.

### 8.5 Onboarding
- Top: welcome message and the user's progress (e.g. `4 of 8 complete · started 12 May 2026`).
- Day-1 setup checklist: each step shows the day label, title, description, and a check-off control. State persists in `onboarding_completions`.
- "Your first week" timeline (Day 1–Day 5) rendered from the steps grouped by `day_label`.
- Key Resources, Tools You'll Use, Key Contacts — pulled from `documents` (filtered by category 'onboarding'), `platform_logins` (category 'everyone'), and a small hardcoded list of contact emails.
- Onboarding videos — for v1, this is just a list of external links (YouTube/Loom/Vimeo). Render the embed if URL matches a known provider; otherwise just a thumbnail-and-link card. Source from a `documents` row with category 'onboarding' and `file_type = 'video'`.

### 8.6 Documents
- Browse by category (HR, Finance, Operations, Brand, Templates, AI/Tech).
- Recently updated list (top 10 by `updated_at`).
- Each card: title, category, last updated, "Open" button that opens `external_url` in a new tab.

### 8.7 Platform Logins
- Banner about confidentiality (see §6).
- Filter pills by category (All, Design, Production, Web, Sales & AM, SEO, Content, Performance, Social Media, Everyone, AI Labs) — match the wireframe.
- Each tool: name, description, login identifier, click-to-reveal password, price, access notes, validity date, external link.
- Admin-only "Add a tool" button at the top of the page.

### 8.8 Internal Comms
- **Templates library** — grid of templates with category filter. Each card has title, description, usage count, owner, "Use template" button that copies the body to clipboard and increments `usage_count`.
- **Channel guide** — list of Slack channels with what-goes-where and owners (from `comms_standards` where `kind = 'channel'`).
- **Response standards** — table from `comms_standards` where `kind = 'response_standard'`.
- **Meeting standards** — Do / Don't lists and the "Meeting or message?" decision tree.
- **Escalation paths** — for each issue type, a numbered sequence of who-to-contact.
- **Announcements archive** — all `announcements` rows, reverse-chronological, searchable.

### 8.9 NEXA Tools
- Cards for each internal tool. Name, description, URL, accent color, status.

### 8.10 Admin area
- One generic CRUD pattern reused across entities. Index page with table, create/edit form, delete with confirmation.
- Use React Hook Form + Zod schemas per entity.
- Markdown editor for SOP bodies and template bodies — use a simple textarea with a live preview pane, not a heavy WYSIWYG.

---

## 9. Visual design

- Match the existing wireframe (`index.html`) closely. Colours, spacing, typography are already proven and approved by Murtaza.
- Fonts: Inter for UI, Instrument Serif for display headings only (the section headers, big numbers).
- Light mode primary. The wireframe has a dark accent on certain modules — preserve that.
- Build a small set of reusable primitives in `src/components/ui/`: `Button`, `Card`, `Badge`, `Input`, `Select`, `Dialog`, `Dropdown`, `CommandPalette`, `Toast`, `Table`. Use Radix headless primitives underneath.
- The command palette behaviour from the existing wireframe (⌘K to open, fuzzy search across pages/SOPs/people/tools, ↑↓↵ to navigate, Esc to close) is a hard requirement — port it.

---

## 10. Build order

Follow this order. Do not jump ahead — earlier steps gate later ones.

1. **Scaffold & infrastructure**
   - `npx create-next-app@latest` with TypeScript and Tailwind v4
   - Set up Supabase project, configure env vars, set up `@supabase/ssr` client utilities
   - Configure Google OAuth in Supabase Auth with `digitalnexa.com` hosted-domain restriction
   - Create the `ADMIN_EMAILS` env var and the sign-in callback that promotes matching emails to `is_admin = true`
   - Build middleware that protects all routes except `/login`
2. **Database**
   - Write the full schema as a migration. Tables, FKs, indexes on `slug`, `category`, `department_id`, `updated_at`. Triggers for `updated_at`.
   - Write RLS policies per §5.
   - Seed minimal sample data: 5 departments, 10 team members (one being Murtaza as admin), 3 SOPs, 5 documents, 10 platform logins, 2 internal tools, 5 announcements, 8 onboarding steps, 3 message templates.
3. **Design system primitives**
   - Build the `ui/` component library before any pages. Get the visual tokens right once and reuse.
4. **App shell**
   - Sidebar layout, top bar, command palette, toast system. Make sure navigation works between empty page stubs first.
5. **Read-only pages, in this order**
   - Team Directory (simplest data, validates the patterns) → Departments → Documents → Platform Logins → SOPs → Internal Comms → NEXA Tools → Home → Onboarding
6. **Onboarding completions** (the only user-write flow)
7. **Admin CRUD area** — generic table + form pattern, applied to every entity in turn
8. **Polish:** search, filters, command palette wiring, mobile layout, empty states, loading skeletons, error boundaries
9. **Deploy to Vercel.** Smoke test end-to-end with Murtaza's account as the only admin.

---

## 11. Non-functional requirements

- **Performance:** Time-to-Interactive under 2s on a desktop connection. Use Next.js server components for read-heavy pages. Avoid client-side data fetching where server-rendering will do.
- **Accessibility:** Keyboard navigation must work everywhere — the command palette already requires this. All interactive elements have visible focus states. Colour contrast meets WCAG AA.
- **Mobile:** Sidebar collapses to a hamburger drawer below 768px. Tables become card lists on narrow viewports.
- **Errors:** Never display raw Supabase errors to the user. Wrap in `try/catch`, log server-side, show a friendly toast.
- **Empty states:** Every list page has a defined empty state — design it deliberately, not as a fallback.
- **Loading states:** Skeleton placeholders for content areas, not spinners.

---

## 12. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never exposed
ADMIN_EMAILS=murtaza@digitalnexa.com    # comma-separated
NEXT_PUBLIC_SITE_URL=https://nexa-handbook.vercel.app
GOOGLE_WORKSPACE_DOMAIN=digitalnexa.com
```

---

## 13. What to ask before building

Before writing code, surface these decisions to Haseeb. Do not guess.

1. **Avatar storage** — Supabase Storage bucket, or do we accept that team member photos are linked from Google Drive / a public URL for now?
2. **Markdown vs. external links for SOPs** — does Murtaza want to author SOPs *inside* the handbook (markdown editor), or always link out to a Google Doc? The data model supports both; the admin UI should follow Murtaza's preference.
3. **Org chart rendering** — is a simple indented tree acceptable, or does it need a proper graph layout (e.g. React Flow)? Indented tree is faster to build and is what I'd recommend for v1.
4. **WhatsApp links** — confirm the format (`https://wa.me/<number>`) and whether all team members should expose this or only some.
5. **Onboarding video hosting** — confirm external links only, no native upload.

---

## 14. Definition of done

- A NEXA employee can sign in with their `@digitalnexa.com` Google account and reach every section.
- Murtaza can log in, see an Admin sidebar item, and create/edit/delete every kind of content from the UI.
- All seed data is replaced by Murtaza's real content within the first week post-launch.
- The wireframe at `nexa-handbook.vercel.app` is replaced by the real app at the same URL.
- The old Google Sheet of platform logins is decommissioned.
- This SPEC.md is updated to reflect any deviations made during the build, so future contributors (human or AI) start from accurate context.
