"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const supabase = createClient();

  async function send() {
    if (!email) return;
    setBusy(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    setSent(true);
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 24px",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          <Logo />
          <span style={{ fontWeight: 700, fontSize: 20 }}>Hours</span>
        </div>
        <h1
          style={{
            fontSize: 30,
            lineHeight: 1.15,
            margin: "0 0 12px",
            letterSpacing: "-0.02em",
          }}
        >
          Track your hours.
          <br />
          See what you really earn.
        </h1>
        <p style={{ color: "var(--text-soft)", margin: 0, fontSize: 15 }}>
          Clock in, clock out, and watch gross turn into the net that actually
          lands in your account.
        </p>
      </div>

      {sent ? (
        <div
          style={{
            background: "var(--sage-100)",
            color: "var(--sage)",
            padding: "16px 18px",
            borderRadius: "var(--radius-sm)",
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          Check your email for the sign-in link.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={inputStyle}
          />
          <button onClick={send} disabled={busy} style={primaryBtn}>
            {busy ? "…" : "Send magic link"}
          </button>
        </div>
      )}
    </main>
  );
}

function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect width="30" height="30" rx="9" fill="var(--ink)" />
      <circle cx="15" cy="15" r="8" stroke="#fff" strokeWidth="1.8" />
      <path
        d="M15 10.5V15L18 17"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--line)",
  fontSize: 16,
  background: "var(--surface)",
  color: "var(--text)",
};

const primaryBtn: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "var(--radius-sm)",
  border: "none",
  background: "var(--ink)",
  color: "#fff",
  fontSize: 16,
  fontWeight: 600,
};
