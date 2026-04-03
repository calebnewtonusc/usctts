"use client";

import { useState } from "react";
import { ArrowLeft, Check, ArrowRight, Handshake } from "lucide-react";
import Link from "next/link";

type PartnerType =
  | "Client Project"
  | "Sponsor"
  | "Speaker"
  | "Recruiting"
  | "Other";

const PARTNER_TYPES: {
  id: PartnerType;
  label: string;
  sub: string;
  color: string;
}[] = [
  {
    id: "Client Project",
    label: "Client Project",
    sub: "Build something with us",
    color: "#CC0000",
  },
  {
    id: "Sponsor",
    label: "Sponsor",
    sub: "Support the org",
    color: "#FFCC00",
  },
  {
    id: "Speaker",
    label: "Speaker",
    sub: "Share your expertise",
    color: "#10b981",
  },
  {
    id: "Recruiting",
    label: "Recruiting",
    sub: "Find talent at USC",
    color: "#6366f1",
  },
  {
    id: "Other",
    label: "Other",
    sub: "Something else entirely",
    color: "#a1a1aa",
  },
];

export default function PartnerPage() {
  const [form, setForm] = useState({
    orgName: "",
    contactName: "",
    email: "",
    partnerType: "" as PartnerType | "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.partnerType) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error: unknown };
        throw new Error(
          typeof data.error === "string" ? data.error : "Something went wrong.",
        );
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    background: "#111113",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          paddingTop: 60,
          paddingBottom: 80,
        }}
      >
        {/* Back */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#6b7280",
            textDecoration: "none",
            marginBottom: 48,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#a1a1aa";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
          }}
        >
          <ArrowLeft size={14} /> Back to TTS
        </Link>

        {submitted ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Check size={24} color="#10b981" />
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}
            >
              Message received.
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "#a1a1aa",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              We&apos;ll review your inquiry and follow up at the email you
              provided within a few business days.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 20px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e4e4e7",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              Back to home
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: "rgba(204,0,0,0.1)",
                    border: "1px solid rgba(204,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Handshake size={11} color="#CC0000" />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Trojan Technology Solutions
                </span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(28px, 5vw, 40px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              >
                Partner with TTS
              </h1>
              <p style={{ fontSize: 15, color: "#a1a1aa", lineHeight: 1.7 }}>
                Whether you have a project, want to sponsor, or just want to get
                in front of USC&apos;s best builders — we&apos;d love to hear
                from you.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Org + Contact Name */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#a1a1aa",
                      marginBottom: 6,
                    }}
                  >
                    Organization name
                  </label>
                  <input
                    required
                    value={form.orgName}
                    onChange={(e) => set("orgName", e.target.value)}
                    placeholder="Acme Corp"
                    style={inputStyle}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(204,0,0,0.4)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#a1a1aa",
                      marginBottom: 6,
                    }}
                  >
                    Your name
                  </label>
                  <input
                    required
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    placeholder="Alex Chen"
                    style={inputStyle}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(204,0,0,0.4)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLInputElement).style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#a1a1aa",
                    marginBottom: 6,
                  }}
                >
                  Work email
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@company.com"
                  style={inputStyle}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      "rgba(204,0,0,0.4)";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                />
              </div>

              {/* Partner type picker */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#a1a1aa",
                    marginBottom: 10,
                  }}
                >
                  What best describes this inquiry?
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {PARTNER_TYPES.map(({ id, label, sub, color }) => {
                    const selected = form.partnerType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => set("partnerType", id)}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 10,
                          background: selected ? `${color}10` : "#111113",
                          border: `1px solid ${selected ? color + "40" : "rgba(255,255,255,0.07)"}`,
                          borderTop: `2px solid ${selected ? color : "transparent"}`,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: selected ? color : "#e4e4e7",
                            marginBottom: 2,
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: "#a1a1aa",
                    marginBottom: 6,
                  }}
                >
                  Tell us more{" "}
                  <span style={{ color: "#71717a" }}>(min 10 characters)</span>
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What are you looking to do? The more detail, the faster we can respond."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLTextAreaElement).style.borderColor =
                      "rgba(204,0,0,0.4)";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLTextAreaElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  style={{ fontSize: 13, color: "#f87171", margin: 0 }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !form.partnerType}
                style={{
                  padding: "13px",
                  borderRadius: 10,
                  background:
                    loading || !form.partnerType
                      ? "rgba(204,0,0,0.4)"
                      : "#CC0000",
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor:
                    loading || !form.partnerType ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  transition: "background 0.15s",
                  minHeight: 48,
                  boxShadow: "0 4px 20px rgba(204,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!loading && form.partnerType)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#aa0000";
                }}
                onMouseLeave={(e) => {
                  if (!loading && form.partnerType)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#CC0000";
                }}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send inquiry <ArrowRight size={15} />
                  </>
                )}
              </button>

              <p
                style={{
                  fontSize: 11,
                  color: "#52525b",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                We respond to all inquiries within a few business days.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
