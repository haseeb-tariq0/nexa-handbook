-- ─────────────────────────────────────────────────────────────────────────────
-- NEXA Ops Handbook — seed data
-- Replace with Murtaza's real content within the first week of launch (SPEC §14).
-- Quantities follow SPEC §10.2.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── departments (5) ────────────────────────────────────────────────────────
insert into public.departments (id, name, slug, description, core_expertise, key_tools, sort_order) values
  ('11111111-1111-1111-1111-000000000001', 'Creative',       'creative',       'Design, art direction, and brand work across all NEXA clients.',           array['Brand identity','Art direction','Motion','Print'],          array['Figma','Adobe CC','Canva'],          1),
  ('11111111-1111-1111-1111-000000000002', 'Account Mgmt',   'account-mgmt',   'Client relationships, project orchestration, and account growth.',          array['Client strategy','Project mgmt','Retention'],               array['Asana','Slack','Google Workspace'],  2),
  ('11111111-1111-1111-1111-000000000003', 'Web',            'web',            'Web development, performance, and conversion optimisation.',                array['Next.js','WordPress','SEO','Performance'],                  array['Vercel','GitHub','GA4'],             3),
  ('11111111-1111-1111-1111-000000000004', 'Social & Content','social-content','Social strategy, content production, scheduling, and community management.',array['Editorial','Content strategy','Community','Scheduling'],    array['Later','Sprout Social','CapCut'],    4),
  ('11111111-1111-1111-1111-000000000005', 'Operations',     'operations',     'Internal operations, finance, HR, and platform stewardship.',               array['Process design','Finance','HR','Vendor mgmt'],              array['Xero','BambooHR','Notion'],          5);

-- ── team_members (10 — Murtaza is admin) ────────────────────────────────────
insert into public.team_members (id, email, full_name, role_title, department_id, slack_handle, working_hours, location, is_active, sort_order) values
  ('22222222-2222-2222-2222-000000000001', 'murtaza@digitalnexa.com', 'Murtaza Talib',  'Operations Manager',     '11111111-1111-1111-1111-000000000005', '@murtaza', 'Sun–Thu · 09:00–18:00 GST', 'Dubai HQ', true, 1),
  ('22222222-2222-2222-2222-000000000002', 'nikhil@digitalnexa.com',  'Nikhil R.',      'Head of Creative',       '11111111-1111-1111-1111-000000000001', '@nikhil',  'Sun–Thu · 09:00–18:00 GST', 'Dubai HQ', true, 2),
  ('22222222-2222-2222-2222-000000000003', 'sheema@digitalnexa.com',  'Sheema A.',      'Senior Account Manager', '11111111-1111-1111-1111-000000000002', '@sheema',  'Sun–Thu · 09:00–18:00 GST', 'Dubai HQ', true, 3),
  ('22222222-2222-2222-2222-000000000004', 'omar@digitalnexa.com',    'Omar K.',        'Web Lead',               '11111111-1111-1111-1111-000000000003', '@omar',    'Sun–Thu · 09:00–18:00 GST', 'Remote',   true, 4),
  ('22222222-2222-2222-2222-000000000005', 'lina@digitalnexa.com',    'Lina M.',        'Social Strategist',      '11111111-1111-1111-1111-000000000004', '@lina',    'Sun–Thu · 09:00–18:00 GST', 'Dubai HQ', true, 5),
  ('22222222-2222-2222-2222-000000000006', 'farah@digitalnexa.com',   'Farah Y.',       'Senior Designer',        '11111111-1111-1111-1111-000000000001', '@farah',   'Sun–Thu · 09:00–18:00 GST', 'Dubai HQ', true, 6),
  ('22222222-2222-2222-2222-000000000007', 'raj@digitalnexa.com',     'Raj P.',         'Account Manager',        '11111111-1111-1111-1111-000000000002', '@raj',     'Sun–Thu · 09:00–18:00 GST', 'Remote',   true, 7),
  ('22222222-2222-2222-2222-000000000008', 'amira@digitalnexa.com',   'Amira S.',       'Content Producer',       '11111111-1111-1111-1111-000000000004', '@amira',   'Sun–Thu · 09:00–18:00 GST', 'Dubai HQ', true, 8),
  ('22222222-2222-2222-2222-000000000009', 'haseeb.t@digitalnexa.com','Haseeb T.',     'Web Developer',          '11111111-1111-1111-1111-000000000003', '@haseeb',  'Sun–Thu · 09:00–18:00 GST', 'Remote',   true, 9),
  ('22222222-2222-2222-2222-00000000000a', 'finance@digitalnexa.com', 'Finance Ops',    'Finance Coordinator',    '11111111-1111-1111-1111-000000000005', '@finance', 'Sun–Thu · 09:00–18:00 GST', 'Dubai HQ', true,10);

-- reports_to chain
update public.team_members set reports_to = '22222222-2222-2222-2222-000000000001' where id in (
  '22222222-2222-2222-2222-000000000002',
  '22222222-2222-2222-2222-000000000003',
  '22222222-2222-2222-2222-000000000004',
  '22222222-2222-2222-2222-000000000005',
  '22222222-2222-2222-2222-00000000000a'
);
update public.team_members set reports_to = '22222222-2222-2222-2222-000000000002' where id = '22222222-2222-2222-2222-000000000006';
update public.team_members set reports_to = '22222222-2222-2222-2222-000000000003' where id = '22222222-2222-2222-2222-000000000007';
update public.team_members set reports_to = '22222222-2222-2222-2222-000000000005' where id = '22222222-2222-2222-2222-000000000008';
update public.team_members set reports_to = '22222222-2222-2222-2222-000000000004' where id = '22222222-2222-2222-2222-000000000009';

-- department leads
update public.departments set lead_id = '22222222-2222-2222-2222-000000000002' where slug = 'creative';
update public.departments set lead_id = '22222222-2222-2222-2222-000000000003' where slug = 'account-mgmt';
update public.departments set lead_id = '22222222-2222-2222-2222-000000000004' where slug = 'web';
update public.departments set lead_id = '22222222-2222-2222-2222-000000000005' where slug = 'social-content';
update public.departments set lead_id = '22222222-2222-2222-2222-000000000001' where slug = 'operations';

-- ── sops (3) ────────────────────────────────────────────────────────────────
insert into public.sops (title, slug, summary, body, department_id, owner_id, is_published, last_reviewed_at) values
  ('Social Media Crisis Response', 'social-crisis-response',
   'Step-by-step procedure when a client-facing post draws negative attention.',
   E'## When to trigger this SOP\n\nThe SOP applies any time a published post receives sustained negative engagement, brand-safety concerns, or media pickup.\n\n## Steps\n\n1. Pause scheduled content for the affected handle.\n2. Notify the AM and the Head of Social within 15 minutes.\n3. Draft a holding response — do not engage until approved.\n4. Escalate to the Operations Manager if media outlets are involved.\n5. Log the incident in the post-mortem template.\n',
   '11111111-1111-1111-1111-000000000004',
   '22222222-2222-2222-2222-000000000005',
   true, now()),
  ('New Client Onboarding', 'new-client-onboarding',
   'How NEXA brings a new retainer or project client into our systems.',
   E'## Day 0: Kick-off\n\n- AM creates client folder in Drive\n- Add to Asana with the standard template\n- Schedule kick-off call within 5 business days\n\n## Day 1–7: Setup\n\n- Brand assets requested\n- Access to client platforms documented in Platform Logins\n- Strategy doc shared\n',
   '11111111-1111-1111-1111-000000000002',
   '22222222-2222-2222-2222-000000000003',
   true, now()),
  ('Website Deployment Checklist', 'website-deployment-checklist',
   'Pre-launch and launch-day checklist for client websites.',
   E'## Pre-launch\n\n- Lighthouse > 90 on all 4 categories\n- All forms tested\n- 301 redirects mapped\n- GA4 + GTM verified\n\n## Launch day\n\n- DNS cutover during low-traffic window\n- Smoke test top 10 URLs\n- Notify AM when complete\n',
   '11111111-1111-1111-1111-000000000003',
   '22222222-2222-2222-2222-000000000004',
   true, now());

-- ── documents (5) ──────────────────────────────────────────────────────────
insert into public.documents (title, description, category, external_url, file_type, owner_id) values
  ('NEXA Brand Guidelines',     'Logo usage, colours, typography, voice.',          'brand',      'https://drive.google.com/example/brand', 'gdoc',  '22222222-2222-2222-2222-000000000002'),
  ('Proposal Template',         'Master proposal deck used by Account Mgmt.',       'templates',  'https://drive.google.com/example/proposal','pptx', '22222222-2222-2222-2222-000000000003'),
  ('Leave Policy 2026',         'Annual leave, sick leave, and bereavement rules.', 'hr',         'https://drive.google.com/example/leave', 'gdoc',  '22222222-2222-2222-2222-000000000001'),
  ('Onboarding Welcome Pack',   'First-week reading for all new starters.',         'onboarding', 'https://drive.google.com/example/welcome','gdoc', '22222222-2222-2222-2222-000000000001'),
  ('Expense Claim Template',    'Spreadsheet template for monthly expenses.',       'finance',    'https://drive.google.com/example/expense','gsheet','22222222-2222-2222-2222-00000000000a');

-- ── platform_logins (10) ───────────────────────────────────────────────────
-- credential_value stored as plaintext per SPEC §6. UI masks with click-to-reveal.
insert into public.platform_logins (tool_name, tool_url, description, category, login_identifier, credential_value, price, access_notes, managed_by_id) values
  ('Figma',         'https://figma.com',        'Design and prototyping.',                  'design',     'design@digitalnexa.com',  'Sign in with Google',         '$45/editor/mo',    'All designers',           '22222222-2222-2222-2222-000000000002'),
  ('Canva for Teams','https://canva.com',       'Brand kits and quick assets.',             'design',     'team@digitalnexa.com',    'Sign in with Google',         '$30/mo (team)',    'Brand kits per client',   '22222222-2222-2222-2222-000000000006'),
  ('Adobe CC',      'https://adobe.com',        'Photoshop, Illustrator, Premiere.',        'production', 'creative@digitalnexa.com','Ask Nikhil for shared login', '$55/seat/mo',      '5 seats — request access','22222222-2222-2222-2222-000000000002'),
  ('Vercel',        'https://vercel.com',       'Web hosting and previews.',                'web',        'web@digitalnexa.com',     'Sign in with Google',         '$20/seat/mo',      'Web team only',           '22222222-2222-2222-2222-000000000004'),
  ('GitHub',        'https://github.com',       'Source control.',                          'web',        'webteam@digitalnexa.com', 'Sign in with Google',         '$4/user/mo',       'Devs + Ops Mgr',          '22222222-2222-2222-2222-000000000004'),
  ('Asana',         'https://asana.com',        'Project management.',                      'sales_am',   'team@digitalnexa.com',    'Sign in with Google',         '$13.49/user/mo',   'Everyone',                '22222222-2222-2222-2222-000000000003'),
  ('Later',         'https://later.com',        'Social scheduling.',                       'social',     'social@digitalnexa.com',  'NexaSocial!2026',             '$45/mo',           'Social team only',        '22222222-2222-2222-2222-000000000005'),
  ('Sprout Social', 'https://sproutsocial.com', 'Listening, scheduling, analytics.',        'social',     'social@digitalnexa.com',  'NexaSprout#2026',             '$249/mo',          'Social team only',        '22222222-2222-2222-2222-000000000005'),
  ('Google Workspace','https://workspace.google.com','Email, Drive, Meet, Calendar.',       'everyone',   'your email',             'SSO — your @digitalnexa.com account','$12/user/mo','Everyone',                 '22222222-2222-2222-2222-000000000001'),
  ('ChatGPT Team',  'https://chat.openai.com',  'AI assistant (shared workspace).',         'ai_labs',    'team@digitalnexa.com',    'Sign in with Google',         '$30/user/mo',      'Everyone — invite only',  '22222222-2222-2222-2222-000000000001');

-- ── internal_tools (2) ─────────────────────────────────────────────────────
insert into public.internal_tools (name, url, description, icon_emoji, accent_color, is_live, sort_order) values
  ('NEXA Pricing Calculator', 'https://pricingcalc.digitalnexa.com', 'Internal tool to scope service proposals and validate pricing.', '🧮', '#9334FF', true, 1),
  ('NEXA Sales Portal',       'https://scorecard.digitalnexa.com',   'Pipeline tracking, prospect qualification, deal scoring.',       '📊', '#5A7888', true, 2);

-- ── announcements (5) ──────────────────────────────────────────────────────
insert into public.announcements (title, body, category, posted_by_id, published_at, is_pinned) values
  ('Welcome to the Handbook', 'The NEXA Ops Handbook is now live — everything operational in one place.', 'ops',   '22222222-2222-2222-2222-000000000001', now() - interval '4 days', true),
  ('New SOP published',       'Social Media Crisis Response is now in the SOPs section.',                  'new',   '22222222-2222-2222-2222-000000000001', now() - interval '3 days', false),
  ('Canva renewed',           'Canva for Teams renewed — all brand kits confirmed active.',                'access','22222222-2222-2222-2222-000000000001', now() - interval '2 days', false),
  ('Team update',             'Welcome Nadia R. joining the Social team next Monday.',                     'team',  '22222222-2222-2222-2222-000000000001', now() - interval '1 day',  false),
  ('Reminder',                'Q2 department reviews due to the Operations Manager by April 30th.',        'reminder','22222222-2222-2222-2222-000000000001', now(),                  false);

-- ── onboarding_steps (8) ───────────────────────────────────────────────────
insert into public.onboarding_steps (title, description, day_label, linked_section, sort_order) values
  ('Confirm SSO + tool access',     'Sign in to Google Workspace, Slack, and Asana. Confirm you can open Figma, Canva, and Adobe CC.', 'Day 1',   'platform-logins', 1),
  ('Meet your team',                'Open the Team Directory. Note your manager, your team, and key contacts in other departments.',   'Day 1',   'team',            2),
  ('Read your department''s SOPs',  'Open the SOPs section, filter by your department, read every procedure relevant to your role.',   'Day 1–2', 'sops',            3),
  ('Review company policies',       'Read HR, data, leave, expense, device, and social-media policies in Documents.',                   'Day 2–3', 'documents',       4),
  ('Internal comms standards',      'Read the Internal Comms section. Know which channels, response times, and escalation paths.',     'Day 3–4', 'internal-comms',  5),
  ('Explore NEXA tools',            'Visit NEXA Tools and try the Pricing Calculator and Sales Portal.',                                'Day 4–5', 'nexa-tools',      6),
  ('1:1 with your manager',         'Book a 30-minute 1:1 with your manager to align on first-month goals.',                            'Day 4–5', null,              7),
  ('Set up your profile',           'Add your avatar, bio, and contact details on your profile page.',                                  'Day 5',   'profile',         8);

-- ── message_templates (3) ──────────────────────────────────────────────────
insert into public.message_templates (title, description, body, category, owner_id) values
  ('Client kick-off email',
   'Used by AMs after a contract is signed.',
   E'Hi {{client name}},\n\nWelcome to NEXA. To kick things off, here is what to expect in your first two weeks:\n\n1. Kick-off call within 5 business days.\n2. Strategy document shared for review.\n3. Asset request list.\n\nYour AM is {{am name}} ({{am email}}). They are your day-to-day contact.\n\nLooking forward to working together.',
   'client_facing', '22222222-2222-2222-2222-000000000003'),
  ('Internal handover',
   'Template for handing a project between team members.',
   E'**Project:** {{project}}\n**From:** {{from}}\n**To:** {{to}}\n\n**Status today:**\n- ...\n\n**Open items:**\n- ...\n\n**Watch-outs:**\n- ...\n\n**Files & access:**\n- ...\n',
   'internal', '22222222-2222-2222-2222-000000000001'),
  ('Escalation to Ops Mgr',
   'Use when a project is blocked and needs Operations Manager intervention.',
   E'**Issue:** ...\n**Impact:** ...\n**What I have tried:** ...\n**What I need:** ...\n**Deadline pressure:** ...\n',
   'escalation', '22222222-2222-2222-2222-000000000001');
