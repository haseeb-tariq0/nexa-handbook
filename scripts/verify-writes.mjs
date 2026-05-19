// One-off script: verifies that the same code path used by admin server
// actions can write to the real Supabase database.
//
// Run: node scripts/verify-writes.mjs
// Reads env from .env.local manually because Node doesn't load it by default.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const text = readFileSync(".env.local", "utf-8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env vars.");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let pass = 0;
let fail = 0;

async function step(label, fn) {
  try {
    await fn();
    console.log(`  ok  ${label}`);
    pass++;
  } catch (e) {
    console.log(`  fail ${label} — ${e.message}`);
    fail++;
  }
}

console.log("Verifying admin write paths against live DB...\n");

// 1. departments — full CRUD
let deptId;
console.log("departments");
await step("insert", async () => {
  const { data, error } = await sb
    .from("departments")
    .insert({
      name: "Verify Test",
      slug: `verify-${Date.now()}`,
      description: "Created by verify-writes.mjs",
      core_expertise: ["tag1", "tag2"],
      key_tools: ["tool1"],
      sort_order: 999,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  deptId = data.id;
});
await step("update", async () => {
  const { error } = await sb
    .from("departments")
    .update({ description: "Updated by verify-writes" })
    .eq("id", deptId);
  if (error) throw new Error(error.message);
});
await step("delete", async () => {
  const { error } = await sb.from("departments").delete().eq("id", deptId);
  if (error) throw new Error(error.message);
});

// 2. announcements
let annId;
console.log("\nannouncements");
await step("insert", async () => {
  const { data, error } = await sb
    .from("announcements")
    .insert({
      title: "Verify test announcement",
      body: "Created by verify-writes.mjs",
      category: "ops",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  annId = data.id;
});
await step("delete", async () => {
  const { error } = await sb.from("announcements").delete().eq("id", annId);
  if (error) throw new Error(error.message);
});

// 3. internal_tools
let toolId;
console.log("\ninternal_tools");
await step("insert", async () => {
  const { data, error } = await sb
    .from("internal_tools")
    .insert({
      name: "Verify Tool",
      url: "https://example.com/verify",
      description: "test",
      icon_emoji: "🔧",
      accent_color: "#9334FF",
      is_live: false,
      sort_order: 999,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  toolId = data.id;
});
await step("delete", async () => {
  const { error } = await sb.from("internal_tools").delete().eq("id", toolId);
  if (error) throw new Error(error.message);
});

// 4. message_templates + RPC
let tplId;
console.log("\nmessage_templates + increment_template_usage RPC");
await step("insert", async () => {
  const { data, error } = await sb
    .from("message_templates")
    .insert({
      title: "Verify template",
      body: "Test body",
      category: "internal",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  tplId = data.id;
});
await step("rpc increment_template_usage", async () => {
  const { error } = await sb.rpc("increment_template_usage", {
    template_id: tplId,
  });
  if (error) throw new Error(error.message);
  const { data } = await sb
    .from("message_templates")
    .select("usage_count")
    .eq("id", tplId)
    .single();
  if (data.usage_count !== 1) throw new Error(`expected 1, got ${data.usage_count}`);
});
await step("delete", async () => {
  const { error } = await sb.from("message_templates").delete().eq("id", tplId);
  if (error) throw new Error(error.message);
});

// 5. onboarding_steps
let stepId;
console.log("\nonboarding_steps");
await step("insert", async () => {
  const { data, error } = await sb
    .from("onboarding_steps")
    .insert({
      title: "Verify step",
      day_label: "Day 9",
      sort_order: 99,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  stepId = data.id;
});
await step("delete", async () => {
  const { error } = await sb.from("onboarding_steps").delete().eq("id", stepId);
  if (error) throw new Error(error.message);
});

// 6. comms_standards (with jsonb meta)
let csId;
console.log("\ncomms_standards");
await step("insert with jsonb meta", async () => {
  const { data, error } = await sb
    .from("comms_standards")
    .insert({
      kind: "escalation_path",
      title: "Verify escalation",
      body: "test",
      meta: { steps: ["AM", "Ops Mgr"] },
      sort_order: 99,
    })
    .select("id, meta")
    .single();
  if (error) throw new Error(error.message);
  csId = data.id;
  if (!Array.isArray(data.meta.steps)) throw new Error("meta.steps not array");
});
await step("delete", async () => {
  const { error } = await sb.from("comms_standards").delete().eq("id", csId);
  if (error) throw new Error(error.message);
});

console.log(`\n${pass} passed · ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
