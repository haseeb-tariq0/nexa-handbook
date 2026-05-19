# NEXA Ops Handbook

The internal operations platform for NEXA — a single destination for every SOP, credential, document, team contact, and internal tool across the agency.

This repo holds a self-contained HTML wireframe of the platform. No build step, no dependencies — open `index.html` in a browser and you have the full app.

## What's in here

- **`index.html`** — the working wireframe. A single-file app with login, dashboard, departments, SOPs, onboarding, documents, platform logins (72 tools), team directory, internal comms, NEXA tools, profile, and settings. Fully wired with modals, toasts, a command palette, notifications, and per-section detail views.
- **`design-spec.html`** — the source design document that describes what each section should contain and how content ownership works. Useful as a reference when extending the wireframe.
- **`vercel.json`** — Vercel deployment config (clean URLs, security headers, cache rules).
- **`.gitignore`** — standard ignores.

## Running locally

No tooling required.

```bash
# Option 1 — just open the file
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux

# Option 2 — serve over a local HTTP server (recommended for clipboard APIs etc.)
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Keyboard shortcuts

- `⌘K` / `Ctrl+K` — open the command palette (search pages, SoPs, people, tools)
- `Esc` — close any modal, palette, or dropdown
- `↑` `↓` `↵` — navigate and open results in the command palette

## Deploying to Vercel

This is a zero-config static site. Two ways to deploy:

### From the dashboard

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Other**. Output directory: **leave blank** (or `.`). Build command: **leave blank**.
4. Click **Deploy**.

That's it — Vercel will serve `index.html` at the root URL.

### From the CLI

```bash
npm i -g vercel
vercel        # link the project on first run
vercel --prod # deploy to production
```

The included `vercel.json` enables clean URLs (so `/index.html` resolves to `/`) and sets sensible security headers.

## Pushing to GitHub

```bash
git remote add origin git@github.com:<your-org>/nexa-handbook.git
git branch -M main
git push -u origin main
```

## Stack

- HTML, CSS, vanilla JavaScript
- Inter + Instrument Serif (Google Fonts)
- Inline SVG icon sprite (Lucide-style)
- No frameworks, no build pipeline, no external state

When this becomes a real product, the recommendation is to migrate the data layer to a CMS or simple JSON backend, keep the rendering layer largely as-is, and add authentication via Google Workspace SSO.
