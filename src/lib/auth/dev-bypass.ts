// Dev-only auth bypass. See memory: [[auth-deferred-to-end]] and CLAUDE.md.
//
// Gated on BOTH conditions:
//   1. NODE_ENV !== 'production' (compile-time guarantee for prod builds)
//   2. DEV_AUTH_BYPASS === 'true' (runtime opt-in)
//
// When auth is wired up at end of build, flip DEV_AUTH_BYPASS to false in .env.local.

export function isDevBypassEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.DEV_AUTH_BYPASS === "true"
  );
}

export type StubProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_admin: boolean;
};

// Stub identity used when bypass is active. Matches the haseeb.t row in seed data.
export const STUB_PROFILE: StubProfile = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "haseeb.t@digitalnexa.com",
  full_name: "Haseeb T. (dev)",
  avatar_url: null,
  is_admin: true,
};
