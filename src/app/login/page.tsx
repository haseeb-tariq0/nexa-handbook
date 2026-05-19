"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./login.module.css";

const WORKSPACE_DOMAIN =
  process.env.NEXT_PUBLIC_WORKSPACE_DOMAIN ?? "digitalnexa.com";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          hd: WORKSPACE_DOMAIN,
          prompt: "select_account",
        },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className={styles.split}>
      {/* LEFT — brand */}
      <aside className={styles.brandPane}>
        <div className={styles.brandTop}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.brandWordmarkTop}
              src="/brand/nexa-logo-white.png"
              alt="NEXA"
            />
            <div className={styles.brandHandle}>@digitalnexa · Ops Handbook</div>
          </div>
        </div>

        <div className={styles.brandMiddle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.brandHeroMark}
            src="/brand/nexa-logo-white.png"
            alt="NEXA"
          />
          <div className={styles.brandEyebrow}>Your operations hub</div>
          <h1 className={styles.brandHeadline}>
            SOPs, credentials, and the whole team — in one place.
          </h1>
          <p className={styles.brandBody}>
            Sign in with your NEXA Google account to access the handbook.
          </p>

          <div className={styles.values}>
            <div className={styles.value}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="13" height="13" rx="1" />
                <rect x="8" y="8" width="13" height="13" rx="1" />
              </svg>
              Honesty
            </div>
            <div className={styles.value}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="8" cy="8" r="2.5" />
                <circle cx="16" cy="8" r="2.5" />
                <circle cx="8" cy="16" r="2.5" />
                <circle cx="16" cy="16" r="2.5" />
              </svg>
              Collaborative
            </div>
            <div className={styles.value}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 4 14 12 6 20" />
                <polyline points="13 4 21 12 13 20" />
              </svg>
              Agile
            </div>
          </div>
        </div>

        <div className={styles.brandBottom}>
          <div className={styles.tagline}>
            <span>CONSULT</span>
            <span>STRATEGISE</span>
            <span>EXECUTE</span>
          </div>
          <div className={styles.pedigree}>20 YEARS</div>
        </div>
      </aside>

      {/* RIGHT — form */}
      <div className={styles.formPane}>
        <div className={styles.formPaneTop}>
          <span className={styles.statusDot} aria-hidden="true" />
          All systems operational
        </div>

        <div className={styles.form}>
          <div className={styles.formEyebrow}>Sign in · employees only</div>
          <h2 className={styles.formTitle}>Welcome back.</h2>
          <p className={styles.formSub}>
            Use your <strong>@{WORKSPACE_DOMAIN}</strong> Google account to
            access the handbook.
          </p>

          <button
            type="button"
            onClick={signIn}
            disabled={loading}
            className={styles.googleBtn}
          >
            <GoogleIcon />
            {loading ? "Redirecting…" : "Continue with Google"}
            <svg
              className={styles.arrow}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formAside}>
            New to NEXA? Ask your manager to add you to the workspace.
          </div>
        </div>

        <div className={styles.formPaneBottom}>
          <span>v1.0</span>
          <span className={styles.sep}>·</span>
          <span>© NEXA Digital</span>
          <span className={styles.sep}>·</span>
          <span>digitalnexa.com</span>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}
