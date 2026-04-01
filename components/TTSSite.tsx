"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import Image from "next/image";
import {
  Eye,
  Zap,
  ArrowRight,
  Check,
  ChevronDown,
  Hammer,
  Briefcase,
  Orbit,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ── Gaze nav engine ──────────────────────────────────────────────────────────
const DWELL_MS = 1000;
let _navTarget: string | null = null;
let _navStart = 0;

function gazeNavUpdate(x: number, y: number, now: number) {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-gaze-nav]"),
  );
  let hit: string | null = null;
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (
      x >= r.left - 28 &&
      x <= r.right + 28 &&
      y >= r.top - 28 &&
      y <= r.bottom + 28
    ) {
      hit = el.dataset.gazeNav ?? null;
      break;
    }
  }
  if (hit !== _navTarget) {
    _navTarget = hit;
    _navStart = now;
  }
  return {
    target: _navTarget,
    progress: _navTarget ? Math.min((now - _navStart) / DWELL_MS, 1) : 0,
  };
}

const ARC = 2 * Math.PI * 10;

const TRACKS = [
  {
    num: "01",
    icon: Hammer,
    accent: "#CC0000",
    accentBg: "rgba(204,0,0,0.08)",
    accentBorder: "rgba(204,0,0,0.2)",
    title: "Building",
    sub: "Product & Startups",
    tagline: "Ship something real this semester.",
    items: [
      "Build apps and tools with AI",
      "Deploy live products with real users",
      "6-week arc from idea to shipped",
      "No CS background required",
    ],
    cta: "For builders, entrepreneurs, and anyone who wants to make something.",
  },
  {
    num: "02",
    icon: Briefcase,
    accent: "#FFCC00",
    accentBg: "rgba(255,204,0,0.06)",
    accentBorder: "rgba(255,204,0,0.2)",
    title: "Consulting",
    sub: "Client Work & Strategy",
    tagline: "Solve real problems for real organizations.",
    items: [
      "Work on live client engagements",
      "AI-first research and analysis",
      "Build and present real deliverables",
      "Strategic reps before you graduate",
    ],
    cta: "For business, econ, poli-sci, and anyone going into strategy or ops.",
  },
  {
    num: "03",
    icon: Orbit,
    accent: "#818cf8",
    accentBg: "rgba(129,140,248,0.08)",
    accentBorder: "rgba(129,140,248,0.2)",
    title: "Orbit",
    sub: "Career & Network Acceleration",
    tagline: "Use AI to get ahead in your own field.",
    items: [
      "Apply AI directly to your major",
      "Access YC founders, McKinsey operators, builders",
      "Speaker series with real practitioners",
      "Career positioning that actually works",
    ],
    cta: "For pre-med, law, finance, architecture, and any major.",
  },
];

const FOUNDERS = [
  {
    id: "caleb",
    name: "Caleb Newton",
    role: "Co-Founder",
    sub: "Entrepreneurship & Technology",
    headshot: "/img/caleb_shot.jpg",
    position: "center top",
    link: "https://calebnewton.me/",
    accent: "#CC0000",
    accentDim: "rgba(204,0,0,0.1)",
    owns: [
      "Product curriculum and AI systems",
      "Website, GitHub, and tooling",
      "Startup relationships and builder culture",
      "Live demos and technical execution",
    ],
  },
  {
    id: "tyler",
    name: "Tyler Larsen",
    role: "Co-Founder",
    sub: "Consulting & People",
    headshot: "/img/tyler_shot.jpeg",
    position: "center center",
    link: "https://www.linkedin.com/in/tyler-larsen-4130a7294/",
    accent: "#FFCC00",
    accentDim: "rgba(255,204,0,0.08)",
    owns: [
      "Consulting curriculum and client pipeline",
      "E-board building and people operations",
      "Partnerships and cross-club ecosystem",
      "Community culture and recruiting",
    ],
  },
];

function FounderCard({ founder }: { founder: (typeof FOUNDERS)[number] }) {
  return (
    <div
      className="tts-fade tts-card"
      style={{
        background: "#111113",
        borderRadius: 24,
        border: "1px solid #1f1f23",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          overflow: "hidden",
        }}
      >
        <Image
          src={founder.headshot}
          alt={founder.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: "cover", objectPosition: founder.position }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.3) 40%, transparent 70%)",
          }}
        />
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: founder.accent,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            {founder.role} · {founder.sub}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {founder.name}
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 28px 28px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {founder.owns.map((item) => (
            <div
              key={item}
              style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: founder.accent,
                  flexShrink: 0,
                  marginTop: 7,
                }}
              />
              <span style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6 }}>
                {item}
              </span>
            </div>
          ))}
        </div>
        <a
          href={founder.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: founder.accent,
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
        >
          View profile <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

export default function TTSSite() {
  const [gazeActive, setGazeActive] = useState(false);
  const [gazeNav, setGazeNav] = useState<{
    target: string | null;
    progress: number;
  }>({
    target: null,
    progress: 0,
  });
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const gazeStartedRef = useRef(false);
  const dwellFiredRef = useRef(false);
  const gazeDotRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const skewBgRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const skewRef = useRef({ vel: 0, lastY: 0 });
  const rafRef = useRef(0);

  // Custom cursor + subtle background skew (not content)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    document.addEventListener("mousemove", onMove);
    const tick = () => {
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * 0.13;
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * 0.13;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringRef.current.x - 16}px, ${ringRef.current.y - 16}px)`;
      }
      // Skew only the decorative background layer, not content
      const y = window.scrollY;
      const rawVel = (y - skewRef.current.lastY) * 0.025;
      skewRef.current.vel += (rawVel - skewRef.current.vel) * 0.08;
      skewRef.current.lastY = y;
      const capped = Math.max(-0.4, Math.min(0.4, skewRef.current.vel));
      if (skewBgRef.current) {
        skewBgRef.current.style.transform = `skewY(${capped.toFixed(3)}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll-aware nav + reading progress bar
  useEffect(() => {
    const handle = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const nearBottom = scrollY + winH >= docH - 200;
      setNavVisible(scrollY > 80 && !nearBottom);
      if (progressBarRef.current) {
        const pct = Math.min(scrollY / (docH - winH), 1);
        progressBarRef.current.style.transform = `scaleX(${pct})`;
      }
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("tts-visible");
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".tts-fade, .tts-slide")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Section tracker for nav dots
  useEffect(() => {
    const sectionIds = ["hero", "mission", "tracks", "leadership", "join"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.3) {
            setActiveSection(e.target.id);
          }
        });
      },
      { threshold: 0.3 },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const startGaze = useCallback(async () => {
    if (gazeStartedRef.current) return;
    let waited = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    while (!(window as any).webgazer && waited < 8000) {
      await new Promise((r) => setTimeout(r, 200));
      waited += 200;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wg = (window as any).webgazer;
    if (!wg) {
      toast.error("WebGazer failed to load. Try refreshing.", { id: "gaze" });
      return;
    }
    let methodWait = 0;
    while (typeof wg.setGazeListener !== "function" && methodWait < 3000) {
      await new Promise((r) => setTimeout(r, 100));
      methodWait += 100;
    }
    if (typeof wg.setGazeListener !== "function") {
      toast.error("WebGazer did not initialize correctly.", { id: "gaze" });
      return;
    }
    try {
      gazeStartedRef.current = true;
      toast.loading("Starting camera...", { id: "gaze", duration: 15000 });
      if (wg.params) wg.params.saveDataAcrossSessions = false;
      await wg
        .setGazeListener((data: { x: number; y: number } | null) => {
          if (!data) return;
          const now = performance.now();
          if (gazeDotRef.current) {
            gazeDotRef.current.style.transform = `translate(${data.x - 12}px, ${data.y - 12}px)`;
            gazeDotRef.current.style.opacity = "1";
          }
          const nav = gazeNavUpdate(data.x, data.y, now);
          setGazeNav(nav);
          if (nav.progress >= 1 && nav.target && !dwellFiredRef.current) {
            dwellFiredRef.current = true;
            scrollTo(nav.target);
            _navTarget = null;
            _navStart = 0;
            setTimeout(() => {
              dwellFiredRef.current = false;
            }, 1400);
          } else if (nav.progress < 0.8) {
            dwellFiredRef.current = false;
          }
        })
        .begin();
      wg.showVideo(false);
      wg.showFaceOverlay(false);
      wg.showFaceFeedbackBox(false);
      wg.showPredictionPoints(false);
      setGazeActive(true);
      toast.success(
        "Eye tracking on. Look at a nav link for 1 second to navigate.",
        {
          id: "gaze",
          duration: 5000,
        },
      );
    } catch (err) {
      console.error("[WebGazer]", err);
      gazeStartedRef.current = false;
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Eye tracking failed: ${msg}`, { id: "gaze" });
    }
  }, [scrollTo]);

  const NAV_LINKS = [
    { label: "Mission", id: "mission" },
    { label: "Tracks", id: "tracks" },
    { label: "Team", id: "leadership" },
  ] as const;

  return (
    <>
      <Script
        src="https://webgazer.cs.brown.edu/webgazer.js"
        strategy="afterInteractive"
      />

      {/* Reading progress bar */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, #CC0000 0%, #FFCC00 100%)",
          transformOrigin: "left",
          transform: "scaleX(0)",
          zIndex: 10000,
          pointerEvents: "none",
        }}
      />

      {/* Section nav dots — proper 44px tap targets */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {(["hero", "mission", "tracks", "leadership", "join"] as const).map(
          (id) => (
            <button
              key={id}
              aria-label={`Scroll to ${id}`}
              onClick={() => scrollTo(id)}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <div
                style={{
                  width: activeSection === id ? 8 : 5,
                  height: activeSection === id ? 8 : 5,
                  borderRadius: "50%",
                  background:
                    activeSection === id ? "#CC0000" : "rgba(255,255,255,0.2)",
                  transition: "all 0.25s ease",
                }}
              />
            </button>
          ),
        )}
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          background: "#CC0000",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
      {/* Cursor ring */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          border: "1.5px solid rgba(204,0,0,0.3)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
        }}
      />
      {/* Gaze indicator */}
      <div
        ref={gazeDotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "2px solid #FFCC00",
          background: "rgba(255,204,0,0.08)",
          pointerEvents: "none",
          zIndex: 9001,
          opacity: 0,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />

      <div
        style={{
          cursor: "none",
          background: "#09090b",
          minHeight: "100vh",
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* ── NAV ── */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(9,9,11,0.9)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            transform: navVisible ? "translateY(0)" : "translateY(-100%)",
            opacity: navVisible ? 1 : 0,
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgba(204,0,0,0.15)",
                  border: "1px solid rgba(204,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={13} color="#CC0000" />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                TTS
              </span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {NAV_LINKS.map(({ label, id }) => {
                const isTarget = gazeNav.target === id;
                return (
                  <button
                    key={id}
                    data-gaze-nav={id}
                    onClick={() => scrollTo(id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#a1a1aa",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "#fff")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.color =
                        "#a1a1aa")
                    }
                  >
                    {gazeActive && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        style={{
                          transform: "rotate(-90deg)",
                          opacity: isTarget ? 1 : 0,
                          transition: "opacity 0.2s",
                          flexShrink: 0,
                        }}
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="rgba(255,204,0,0.15)"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          fill="none"
                          stroke="#FFCC00"
                          strokeWidth="2.5"
                          strokeDasharray={`${gazeNav.progress * ARC} ${ARC}`}
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!gazeActive ? (
                <button
                  onClick={startGaze}
                  title="Enable eye tracking navigation"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    color: "#71717a",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,204,0,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#FFCC00";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,204,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#71717a";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <Eye size={14} />
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: "rgba(255,204,0,0.08)",
                    border: "1px solid rgba(255,204,0,0.2)",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#FFCC00",
                    }}
                  />
                  <span
                    style={{ fontSize: 11, color: "#FFCC00", fontWeight: 600 }}
                  >
                    EYE NAV ON
                  </span>
                </div>
              )}
              <button
                onClick={() => scrollTo("join")}
                style={{
                  padding: "7px 18px",
                  borderRadius: 10,
                  background: "#CC0000",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: "0 2px 12px rgba(204,0,0,0.3)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#aa0000";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#CC0000";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section
          id="hero"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative background layer with subtle skew */}
          <div
            ref={skewBgRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-20%",
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(204,0,0,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
              willChange: "transform",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 860,
              textAlign: "center",
            }}
          >
            <div
              className="tts-fade"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 100,
                background: "rgba(204,0,0,0.08)",
                border: "1px solid rgba(204,0,0,0.2)",
                marginBottom: 36,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#CC0000",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#CC0000",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                USC Student Organization · Founded 2023
              </span>
            </div>

            <h1
              className="tts-slide"
              style={{
                fontSize: "clamp(64px, 10vw, 120px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                marginBottom: 36,
                transitionDelay: "0.1s",
              }}
            >
              <span style={{ color: "#fff", display: "block" }}>Build.</span>
              <span style={{ color: "#fff", display: "block" }}>Solve.</span>
              <span
                style={{
                  display: "block",
                  color: "transparent",
                  WebkitTextStroke: "2px #CC0000",
                }}
              >
                Ship.
              </span>
            </h1>

            <p
              className="tts-fade"
              style={{
                fontSize: "clamp(16px, 2vw, 19px)",
                color: "#71717a",
                lineHeight: 1.7,
                maxWidth: 520,
                margin: "0 auto 16px",
                transitionDelay: "0.2s",
              }}
            >
              Trojan Technology Solutions is USC&apos;s builder club. AI tools,
              real products, real client work, real growth.
            </p>

            <p
              className="tts-fade"
              style={{
                fontSize: 13,
                color: "#3f3f46",
                marginBottom: 52,
                transitionDelay: "0.25s",
                letterSpacing: "0.02em",
              }}
            >
              Any major. Any year. Join anytime.
            </p>

            <div
              className="tts-fade"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
                transitionDelay: "0.3s",
              }}
            >
              <button
                onClick={() => scrollTo("join")}
                style={{
                  padding: "14px 36px",
                  borderRadius: 14,
                  background: "#CC0000",
                  border: "none",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: "0 8px 32px rgba(204,0,0,0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#aa0000";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#CC0000";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                Apply Now <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollTo("tracks")}
                style={{
                  padding: "14px 32px",
                  borderRadius: 14,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#a1a1aa",
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.25)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#a1a1aa";
                }}
              >
                See the tracks
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div
            className="tts-fade"
            style={{
              position: "absolute",
              bottom: 56,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 48,
              transitionDelay: "0.5s",
              whiteSpace: "nowrap",
            }}
          >
            {[
              ["3", "Tracks"],
              ["100%", "Free"],
              ["Any", "Major"],
            ].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {val}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#52525b",
                    marginTop: 2,
                    letterSpacing: "0.04em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              opacity: 0.18,
            }}
          >
            <div style={{ width: 1, height: 24, background: "#fff" }} />
            <span
              style={{
                fontSize: 9,
                color: "#fff",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Scroll
            </span>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section
          id="mission"
          style={{ background: "#0d0d10", padding: "128px 24px" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 96,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  className="tts-fade"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: "#CC0000",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#CC0000",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Why TTS Exists
                  </span>
                </div>
                <h2
                  className="tts-slide"
                  style={{
                    fontSize: "clamp(32px, 3.5vw, 52px)",
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    marginBottom: 28,
                    transitionDelay: "0.1s",
                  }}
                >
                  AI is changing
                  <br />
                  <span style={{ color: "#CC0000" }}>every industry.</span>
                  <br />
                  Are you using it?
                </h2>
                <p
                  className="tts-fade"
                  style={{
                    fontSize: 16,
                    color: "#71717a",
                    lineHeight: 1.8,
                    marginBottom: 18,
                    transitionDelay: "0.2s",
                  }}
                >
                  There are two types of students graduating right now. Those
                  who ignored AI and fell behind. Those who learned to use it
                  and moved ahead.
                </p>
                <p
                  className="tts-fade"
                  style={{
                    fontSize: 16,
                    color: "#71717a",
                    lineHeight: 1.8,
                    marginBottom: 40,
                    transitionDelay: "0.25s",
                  }}
                >
                  TTS exists for the second group. We built a club where the
                  standard is actually shipping, actually consulting, actually
                  growing.
                </p>

                <div
                  className="tts-fade"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transitionDelay: "0.3s",
                  }}
                >
                  {[
                    { accent: "#CC0000", text: "Less talk, more shipping" },
                    {
                      accent: "#FFCC00",
                      text: "Less theory, more client work",
                    },
                    {
                      accent: "#818cf8",
                      text: "Less gatekeeping, more open doors",
                    },
                    {
                      accent: "#CC0000",
                      text: "Less burnout, more sustainable intensity",
                    },
                  ].map(({ accent, text }) => (
                    <div
                      key={text}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: accent,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 15, color: "#d4d4d8" }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div
                  className="tts-fade"
                  style={{
                    position: "relative",
                    borderRadius: 20,
                    overflow: "hidden",
                    aspectRatio: "4/3",
                  }}
                >
                  <Image
                    src="/img/team-photo.webp"
                    alt="TTS Team"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center 20%" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(9,9,11,0.75) 0%, transparent 55%)",
                    }}
                  />
                  <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}
                    >
                      TTS at USC
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#a1a1aa", marginTop: 2 }}
                    >
                      University of Southern California
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                  }}
                >
                  {[
                    { val: "Any major", label: "No prerequisites" },
                    { val: "Join anytime", label: "No cut-off date" },
                    { val: "Always free", label: "No dues" },
                  ].map(({ val, label }) => (
                    <div
                      key={label}
                      className="tts-fade tts-card"
                      style={{
                        background: "#16161a",
                        borderRadius: 14,
                        border: "1px solid #222226",
                        padding: "18px 14px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#fff",
                          marginBottom: 4,
                        }}
                      >
                        {val}
                      </div>
                      <div style={{ fontSize: 11, color: "#52525b" }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 72 }}>
              <button
                onClick={() => scrollTo("tracks")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 24px",
                  borderRadius: 12,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#71717a",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#71717a";
                }}
              >
                Pick your track <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ── TRACKS ── */}
        <section
          id="tracks"
          style={{ background: "#09090b", padding: "128px 24px" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ marginBottom: 72 }}>
              <div
                className="tts-fade"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 20,
                    background: "#FFCC00",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#FFCC00",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Pick Your Path
                </span>
              </div>
              <h2
                className="tts-slide"
                style={{
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  marginBottom: 14,
                  transitionDelay: "0.1s",
                }}
              >
                Three tracks.
                <br />
                One community.
              </h2>
              <p
                className="tts-fade"
                style={{
                  fontSize: 15,
                  color: "#52525b",
                  transitionDelay: "0.2s",
                }}
              >
                You can switch. Most people end up doing two.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {TRACKS.map(
                (
                  {
                    num,
                    icon: Icon,
                    accent,
                    accentBg,
                    accentBorder,
                    title,
                    sub,
                    tagline,
                    items,
                    cta,
                  },
                  i,
                ) => (
                  <div
                    key={num}
                    className="tts-fade tts-card"
                    style={{
                      background: "#111113",
                      borderRadius: 20,
                      border: "1px solid #1f1f23",
                      padding: "36px 32px",
                      transitionDelay: `${i * 0.1}s`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 24,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "#2a2a2e")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLDivElement).style.borderColor =
                        "#1f1f23")
                    }
                  >
                    {/* Header */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 20,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            background: accentBg,
                            border: `1px solid ${accentBorder}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon size={20} color={accent} />
                        </div>
                        <span
                          style={{
                            fontSize: 42,
                            fontWeight: 900,
                            color: accent,
                            letterSpacing: "-0.04em",
                            lineHeight: 1,
                            opacity: 0.18,
                          }}
                        >
                          {num}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: accent,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        {sub}
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 900,
                          color: "#fff",
                          letterSpacing: "-0.02em",
                          marginBottom: 8,
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#52525b",
                          lineHeight: 1.6,
                        }}
                      >
                        {tagline}
                      </div>
                    </div>

                    {/* Items */}
                    <ul
                      style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {items.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            fontSize: 13,
                            color: "#a1a1aa",
                          }}
                        >
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background: accent,
                              flexShrink: 0,
                              marginTop: 6,
                            }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* Who it's for */}
                    <div
                      style={{
                        background: accentBg,
                        border: `1px solid ${accentBorder}`,
                        borderRadius: 12,
                        padding: "14px 16px",
                        marginTop: "auto",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: accent,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Who it&apos;s for
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#71717a",
                          lineHeight: 1.7,
                        }}
                      >
                        {cta}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div style={{ textAlign: "center", marginTop: 64 }}>
              <button
                onClick={() => scrollTo("leadership")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 24px",
                  borderRadius: 12,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#71717a",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.18)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#71717a";
                }}
              >
                Meet the founders <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ── LEADERSHIP ── */}
        <section
          id="leadership"
          style={{ background: "#0d0d10", padding: "128px 24px" }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div
              className="tts-fade"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 20,
                  background: "#FFCC00",
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#FFCC00",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Founders
              </span>
            </div>
            <h2
              className="tts-slide"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
                marginBottom: 56,
                transitionDelay: "0.1s",
              }}
            >
              Built by builders
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {FOUNDERS.map((founder, i) => (
                <div
                  key={founder.id}
                  className="tts-fade"
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <FounderCard founder={founder} />
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 72 }}>
              <button
                onClick={() => scrollTo("join")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 32px",
                  borderRadius: 12,
                  background: "#CC0000",
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: "0 4px 20px rgba(204,0,0,0.35)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#aa0000";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#CC0000";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                Join TTS <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ── JOIN ── */}
        <section
          id="join"
          style={{ background: "#09090b", padding: "128px 24px" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 80,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  className="tts-fade"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: "#CC0000",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#CC0000",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Get In
                  </span>
                </div>
                <h2
                  className="tts-slide"
                  style={{
                    fontSize: "clamp(32px, 4vw, 52px)",
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    marginBottom: 24,
                    transitionDelay: "0.1s",
                  }}
                >
                  The door is
                  <br />
                  <span style={{ color: "#CC0000" }}>always open.</span>
                </h2>
                <p
                  className="tts-fade"
                  style={{
                    fontSize: 16,
                    color: "#71717a",
                    lineHeight: 1.8,
                    marginBottom: 40,
                    transitionDelay: "0.2s",
                  }}
                >
                  No waitlist. No interview. No experience required. If you want
                  to build, consult, or grow in your field using AI, show up.
                </p>

                <div
                  className="tts-fade"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    transitionDelay: "0.3s",
                  }}
                >
                  {[
                    "Join any week this semester",
                    "Pick a track or try all three",
                    "Work on live projects from day one",
                    "Access our speaker and mentor network",
                    "No dues, no gatekeeping, no nonsense",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        className="tts-check-appear"
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "rgba(255,204,0,0.08)",
                          border: "1px solid rgba(255,204,0,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={11} color="#FFCC00" strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: 14, color: "#a1a1aa" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Student */}
                <div
                  className="tts-fade tts-card"
                  style={{
                    background: "#111113",
                    borderRadius: 20,
                    border: "1px solid rgba(204,0,0,0.3)",
                    padding: "32px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#CC0000",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    For USC Students
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 10,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Join as a member
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#52525b",
                      lineHeight: 1.75,
                      marginBottom: 24,
                    }}
                  >
                    Any major, any year. Build products, work on client
                    projects, and connect with people who are serious about
                    growing.
                  </p>
                  <button
                    onClick={() => window.open("#", "_blank")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      width: "100%",
                      padding: "13px",
                      borderRadius: 12,
                      background: "#CC0000",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 24px rgba(204,0,0,0.3)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#aa0000";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#CC0000";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    Student Application <ArrowRight size={15} />
                  </button>
                </div>

                {/* Organization */}
                <div
                  className="tts-fade tts-card"
                  style={{
                    background: "#111113",
                    borderRadius: 20,
                    border: "1px solid #1f1f23",
                    padding: "32px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#FFCC00",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    For Organizations
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 10,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Work with TTS
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#52525b",
                      lineHeight: 1.75,
                      marginBottom: 24,
                    }}
                  >
                    Get a dedicated team of USC students to solve a real problem
                    in your organization. Pro-bono.
                  </p>
                  <button
                    onClick={() => window.open("#", "_blank")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      width: "100%",
                      padding: "13px",
                      borderRadius: 12,
                      background: "rgba(255,204,0,0.08)",
                      border: "1px solid rgba(255,204,0,0.2)",
                      color: "#FFCC00",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,204,0,0.15)";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,204,0,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    Partner with us <ArrowRight size={15} />
                  </button>
                </div>

                {/* Email capture */}
                <div
                  style={{
                    background: "#111113",
                    borderRadius: 16,
                    border: "1px solid #1a1a1e",
                    padding: "22px",
                  }}
                >
                  {!emailSubmitted ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (email.trim() && !emailLoading) {
                          setEmailLoading(true);
                          setTimeout(() => {
                            setEmailLoading(false);
                            setEmailSubmitted(true);
                          }, 700);
                        }
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Not ready? Leave your email"
                        required
                        disabled={emailLoading}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: 10,
                          background: "#0d0d10",
                          border: "1px solid #222226",
                          color: "#fff",
                          fontSize: 13,
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => {
                          (
                            e.currentTarget as HTMLInputElement
                          ).style.borderColor = "rgba(204,0,0,0.4)";
                        }}
                        onBlur={(e) => {
                          (
                            e.currentTarget as HTMLInputElement
                          ).style.borderColor = "#222226";
                        }}
                      />
                      <button
                        type="submit"
                        disabled={emailLoading}
                        style={{
                          width: "100%",
                          padding: "11px 16px",
                          borderRadius: 10,
                          background: emailLoading
                            ? "rgba(204,0,0,0.06)"
                            : "rgba(204,0,0,0.1)",
                          border: "1px solid rgba(204,0,0,0.2)",
                          color: emailLoading ? "#52525b" : "#CC0000",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: emailLoading ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        {emailLoading ? (
                          <>
                            <div
                              style={{
                                width: 13,
                                height: 13,
                                borderRadius: "50%",
                                border: "2px solid rgba(204,0,0,0.2)",
                                borderTopColor: "#CC0000",
                                animation: "spin 0.7s linear infinite",
                              }}
                            />
                            Saving...
                          </>
                        ) : (
                          "Notify me"
                        )}
                      </button>
                    </form>
                  ) : (
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: 12,
                        background:
                          "linear-gradient(135deg, rgba(204,0,0,0.06) 0%, rgba(255,204,0,0.04) 100%)",
                        border: "1px solid rgba(255,204,0,0.15)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        className="tts-check-appear"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "rgba(255,204,0,0.08)",
                          border: "1.5px solid #FFCC00",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                        }}
                      >
                        <Check size={18} color="#FFCC00" strokeWidth={2.5} />
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#fff",
                          marginBottom: 4,
                        }}
                      >
                        You&apos;re on the list.
                      </div>
                      <div style={{ fontSize: 12, color: "#52525b" }}>
                        We&apos;ll be in touch soon.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            background: "#09090b",
            borderTop: "1px solid #16161a",
            padding: "28px 32px",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#3f3f46",
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: "rgba(204,0,0,0.08)",
                  border: "1px solid rgba(204,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={9} color="#CC0000" />
              </div>
              Trojan Technology Solutions · USC
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#27272a",
                letterSpacing: "0.04em",
              }}
            >
              Built at USC · {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
