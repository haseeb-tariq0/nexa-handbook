"use client";

// Top-level fallback. Triggered when (app)/error.tsx itself errors,
// or when the root layout throws. Must include <html> and <body>.

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#FAFAF7",
          color: "#0F0F14",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            textAlign: "center",
            background: "#FFFFFF",
            border: "1px solid #ECEAF1",
            borderRadius: 12,
            padding: 40,
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              margin: "0 0 8px",
              color: "#0F0F14",
            }}
          >
            The Handbook hit an error.
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#7C7986",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            Please try again. If this keeps happening, contact the Operations
            Manager.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#0F0F14",
              color: "#FFFFFF",
              border: 0,
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 10,
                color: "#A8A4B1",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
