"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import Image from "next/image";
import {
  Eye,
  Zap,
  ArrowRight,
  Check,
  Hammer,
  Briefcase,
  TrendingUp,
  ExternalLink,
  Mail,
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
    title: "Building",
    sub: "Product & Startups",
    tagline: "Ship something real this semester.",
    items: [
      "Build apps and tools with AI",
      "Deploy live products with real users",
      "6-week arc from idea to shipped",
      "No CS background required",
    ],
    for: "Builders, entrepreneurs, anyone who wants to make something.",
  },
  {
    num: "02",
    icon: Briefcase,
    accent: "#FFCC00",
    title: "Consulting",
    sub: "Client Work & Strategy",
    tagline: "Solve real problems for real organizations.",
    items: [
      "Live client engagements",
      "AI-first research and analysis",
      "Real deliverables and presentations",
      "Strategic reps before you graduate",
    ],
    for: "Business, econ, poli-sci, and anyone going into strategy or ops.",
  },
  {
    num: "03",
    icon: TrendingUp,
    accent: "#818cf8",
    title: "Grow",
    sub: "Career & Network",
    tagline: "Use AI to get ahead in your own field.",
    items: [
      "Apply AI directly to your major",
      "Access YC founders, McKinsey operators",
      "Speaker series with real practitioners",
      "Career positioning that works",
    ],
    for: "Pre-med, law, finance, architecture, any major.",
  },
];

const FOUNDERS = [
  {
    id: "caleb",
    name: "Caleb Newton",
    role: "Co-Founder",
    focus: "Entrepreneurship & Technology",
    headshot: "/img/caleb_shot.jpg",
    position: "center 15%",
    link: "https://calebnewton.me/",
    accent: "#CC0000",
    owns: [
      "Product curriculum and AI systems",
      "Website, GitHub, and tooling",
      "Startup relationships and builder culture",
      "Technical execution and live demos",
    ],
  },
  {
    id: "tyler",
    name: "Tyler Larsen",
    role: "Co-Founder",
    focus: "Consulting & People",
    headshot: "/img/tyler_shot.jpeg",
    position: "center center",
    link: "https://www.linkedin.com/in/tyler-larsen-4130a7294/",
    accent: "#FFCC00",
    owns: [
      "Consulting curriculum and client pipeline",
      "E-board building and people operations",
      "Partnerships and cross-club ecosystem",
      "Community culture and recruiting",
    ],
  },
];

const APPLICATION_URL =
  "mailto:trojantechsolutions@gmail.com?subject=TTS Application";
const PARTNERSHIP_URL =
  "mailto:trojantechsolutions@gmail.com?subject=Partnership Inquiry";

export default function TTSSite() {
  const [gazeActive, setGazeActive] = useState(false);
  const [gazeNav, setGazeNav] = useState<{
    target: string | null;
    progress: number;
  }>({ target: null, progress: 0 });
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [heroProgress, setHeroProgress] = useState(0);
  const gazeStartedRef = useRef(false);
  const dwellFiredRef = useRef(false);
  const gazeDotRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ringRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(0);

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
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const handle = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.min(scrollY / (docH - winH), 1)})`;
      }
      if (heroSectionRef.current) {
        const sect = heroSectionRef.current;
        const scrolled = scrollY - sect.offsetTop;
        const maxScroll = sect.offsetHeight - winH;
        const prog = Math.max(0, Math.min(1, scrolled / maxScroll));
        setHeroProgress(prog);
        // Nav appears after morph begins (prog > 0.60) or past the hero entirely
        const pastShip =
          prog > 0.6 || scrollY > sect.offsetTop + sect.offsetHeight;
        setNavVisible(pastShip && scrollY + winH < docH - 200);
      }
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("tts-visible");
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(
        ".tts-fade, .tts-slide, .tts-from-left, .tts-from-right, .tts-scale, .tts-curtain, .tts-perspective",
      )
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.3)
            setActiveSection(e.target.id);
        }),
      { threshold: 0.3 },
    );
    ["hero", "mission", "tracks", "leadership", "join"].forEach((id) => {
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
      toast.error("WebGazer failed to load.", { id: "gaze" });
      return;
    }
    let mw = 0;
    while (typeof wg.setGazeListener !== "function" && mw < 3000) {
      await new Promise((r) => setTimeout(r, 100));
      mw += 100;
    }
    if (typeof wg.setGazeListener !== "function") {
      toast.error("WebGazer did not initialize.", { id: "gaze" });
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
      toast.success("Eye tracking on. Look at a nav link for 1s to navigate.", {
        id: "gaze",
        duration: 5000,
      });
    } catch (err) {
      console.error("[WebGazer]", err);
      gazeStartedRef.current = false;
      toast.error(
        `Eye tracking failed: ${err instanceof Error ? err.message : String(err)}`,
        { id: "gaze" },
      );
    }
  }, [scrollTo]);

  // Scroll-driven hero word reveal thresholds
  const word2Shown = heroProgress > 0.2;
  const word3Shown = heroProgress > 0.38;
  const wordsMorphing = heroProgress > 0.54; // crossfade: Build/Solve/Ship → Trojan/Tech/Solutions
  const heroContentShown = heroProgress > 0.74;

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

      {/* Progress bar */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg,#CC0000,#FFCC00)",
          transformOrigin: "left",
          transform: "scaleX(0)",
          zIndex: 10000,
          pointerEvents: "none",
        }}
      />

      {/* Nav dots */}
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
          gap: 4,
        }}
      >
        {(["hero", "mission", "tracks", "leadership", "join"] as const).map(
          (id) => (
            <button
              key={id}
              aria-label={`Go to ${id}`}
              onClick={() => scrollTo(id)}
              style={{
                width: 32,
                height: 28,
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
                  width: activeSection === id ? 6 : 4,
                  height: activeSection === id ? 6 : 4,
                  borderRadius: "50%",
                  background:
                    activeSection === id ? "#CC0000" : "rgba(255,255,255,0.2)",
                  transition: "all 0.2s",
                }}
              />
            </button>
          ),
        )}
      </div>

      {/* Cursor */}
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
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          border: "1px solid rgba(204,0,0,0.25)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
        }}
      />
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
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 40px",
              height: 56,
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
                gap: 9,
                cursor: "pointer",
                background: "none",
                border: "none",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: "rgba(204,0,0,0.12)",
                  border: "1px solid rgba(204,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={12} color="#CC0000" />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                }}
              >
                TTS
              </span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                      borderRadius: 8,
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
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    color: "#a1a1aa",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,204,0,0.08)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#FFCC00";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,204,0,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#a1a1aa";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.1)";
                  }}
                >
                  <Eye size={14} />
                </button>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 8,
                    background: "rgba(255,204,0,0.08)",
                    border: "1px solid rgba(255,204,0,0.2)",
                  }}
                >
                  <div
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#FFCC00",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: "#FFCC00",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    EYE NAV
                  </span>
                </div>
              )}
              <button
                onClick={() => scrollTo("join")}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  background: "#CC0000",
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  minHeight: 36,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#aa0000";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#CC0000";
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── scroll-pinned 3-word reveal */}
        <section
          id="hero"
          ref={heroSectionRef}
          style={{
            height: "300vh",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
              background: "#09090b",
            }}
          >
            {/* Dot grid */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
                pointerEvents: "none",
              }}
            />
            {/* Cardinal glow */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "40%",
                left: "45%",
                transform: "translate(-50%,-50%)",
                width: 700,
                height: 700,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(204,0,0,0.06) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                width: "100%",
                padding: "0 40px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Badge — appears after Ship., hides when full content block shows */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "4px 12px",
                  borderRadius: 100,
                  background: "rgba(204,0,0,0.08)",
                  border: "1px solid rgba(204,0,0,0.2)",
                  marginBottom: 40,
                  opacity: word3Shown && !wordsMorphing ? 1 : 0,
                  transform:
                    word3Shown && !wordsMorphing
                      ? "translateY(0)"
                      : "translateY(8px)",
                  transition:
                    "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                  pointerEvents: word3Shown && !wordsMorphing ? "auto" : "none",
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
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

              {/* Scroll-driven word reveal + morph into Trojan Tech Solutions */}
              <h1
                style={{
                  fontSize: "clamp(72px, 9vw, 112px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.9,
                  margin: 0,
                  padding: 0,
                }}
              >
                {/* Slot 1: Build. → Trojan */}
                <span style={{ display: "block", position: "relative" }}>
                  <span
                    style={{
                      display: "block",
                      color: "#fff",
                      opacity: wordsMorphing ? 0 : 1,
                      transform: wordsMorphing
                        ? "translateY(0.12em) scale(0.96)"
                        : "translateY(0) scale(1)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    Build.
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "block",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#fff",
                      opacity: wordsMorphing ? 1 : 0,
                      transform: wordsMorphing
                        ? "translateY(0) scale(1)"
                        : "translateY(-0.12em) scale(0.96)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s",
                    }}
                  >
                    Trojan
                  </span>
                </span>

                {/* Slot 2: Solve. → Tech */}
                <span style={{ display: "block", position: "relative" }}>
                  <span
                    style={{
                      display: "block",
                      color: "#fff",
                      opacity: wordsMorphing ? 0 : word2Shown ? 1 : 0,
                      transform: wordsMorphing
                        ? "scale(0.94)"
                        : word2Shown
                          ? "translateY(0)"
                          : "translateY(48px)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    Solve.
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "block",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#FFCC00",
                      opacity: wordsMorphing ? 1 : 0,
                      transform: wordsMorphing ? "scale(1)" : "scale(0.94)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.18s",
                    }}
                  >
                    Tech
                  </span>
                </span>

                {/* Slot 3: Ship. → Solutions */}
                <span style={{ display: "block", position: "relative" }}>
                  <span
                    style={{
                      display: "block",
                      color: "#CC0000",
                      opacity: wordsMorphing ? 0 : word3Shown ? 1 : 0,
                      transform: wordsMorphing
                        ? "translateY(-0.12em) scale(0.96)"
                        : word3Shown
                          ? "translateY(0) scale(1)"
                          : "translateY(48px) scale(1)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    Ship.
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "block",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: "#CC0000",
                      opacity: wordsMorphing ? 1 : 0,
                      transform: wordsMorphing
                        ? "translateY(0) scale(1)"
                        : "translateY(0.12em) scale(0.96)",
                      transition:
                        "opacity 0.55s cubic-bezier(0.16,1,0.3,1) 0.26s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.26s",
                    }}
                  >
                    Solutions
                  </span>
                </span>
              </h1>

              {/* Content block — fades in at 75% scroll, replaces badge */}
              <div
                style={{
                  marginTop: 48,
                  opacity: heroContentShown ? 1 : 0,
                  transform: heroContentShown
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transition:
                    "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
                  pointerEvents: heroContentShown ? "auto" : "none",
                }}
              >
                <p
                  style={{
                    fontSize: 18,
                    color: "#d4d4d8",
                    lineHeight: 1.65,
                    maxWidth: 480,
                    marginBottom: 8,
                  }}
                >
                  Trojan Technology Solutions is USC&apos;s builder club.
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "#a1a1aa",
                    marginBottom: 44,
                  }}
                >
                  AI tools. Real products. Real client work. Any major.
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 72,
                  }}
                >
                  <button
                    onClick={() => scrollTo("join")}
                    style={{
                      padding: "12px 28px",
                      borderRadius: 10,
                      background: "#CC0000",
                      border: "none",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      boxShadow: "0 4px 24px rgba(204,0,0,0.3)",
                      minHeight: 44,
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
                    Apply Now <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => scrollTo("tracks")}
                    style={{
                      padding: "12px 24px",
                      borderRadius: 10,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#e4e4e7",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      minHeight: 44,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(255,255,255,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#fff";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "rgba(255,255,255,0.15)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "#e4e4e7";
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                  >
                    See the tracks
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 48,
                    paddingTop: 32,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {[
                    ["3", "Tracks"],
                    ["100%", "Free"],
                    ["Any major", "Welcome"],
                  ].map(([val, label]) => (
                    <div key={label}>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#fff",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {val}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#a1a1aa",
                          marginTop: 3,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section
          id="mission"
          style={{ background: "#0c0c0f", padding: "120px 40px" }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 100,
              alignItems: "start",
            }}
          >
            <div>
              {/* No generic label here. Let the content lead. */}
              <h2
                className="tts-from-left"
                style={{
                  fontSize: "clamp(28px, 3.5vw, 46px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  marginBottom: 32,
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
                  color: "#d4d4d8",
                  lineHeight: 1.8,
                  marginBottom: 16,
                  transitionDelay: "0.08s",
                }}
              >
                There are two types of students graduating right now. Those who
                ignored AI and fell behind. Those who learned to use it and
                moved ahead.
              </p>
              <p
                className="tts-fade"
                style={{
                  fontSize: 16,
                  color: "#a1a1aa",
                  lineHeight: 1.8,
                  marginBottom: 44,
                  transitionDelay: "0.12s",
                }}
              >
                TTS exists for the second group. The standard is actually
                shipping, actually consulting, actually growing.
              </p>
              <div
                className="tts-fade"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transitionDelay: "0.18s",
                }}
              >
                {[
                  { c: "#CC0000", t: "Less talk, more shipping" },
                  { c: "#FFCC00", t: "Less theory, more client work" },
                  { c: "#818cf8", t: "Less gatekeeping, more open doors" },
                  {
                    c: "#CC0000",
                    t: "Less burnout, more sustainable intensity",
                  },
                ].map(({ c, t }) => (
                  <div
                    key={t}
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: c,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 15, color: "#d4d4d8" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                className="tts-curtain"
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  aspectRatio: "16/10",
                }}
              >
                <Image
                  src="/img/ttsgroup.png"
                  alt="TTS community at USC"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center 30%" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(9,9,11,0.8) 0%, transparent 50%)",
                  }}
                />
                <div style={{ position: "absolute", bottom: 18, left: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                    TTS at USC
                  </div>
                  <div style={{ fontSize: 11, color: "#a1a1aa", marginTop: 2 }}>
                    University of Southern California
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  ["Any major", "No prerequisites"],
                  ["Join anytime", "No cut-off"],
                  ["Always free", "No dues"],
                ].map(([v, l]) => (
                  <div
                    key={l}
                    className="tts-scale tts-card"
                    style={{
                      background: "#141418",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.06)",
                      padding: "16px 12px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#e4e4e7",
                        marginBottom: 4,
                      }}
                    >
                      {v}
                    </div>
                    <div style={{ fontSize: 10, color: "#a1a1aa" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRACKS ── */}
        <section
          id="tracks"
          style={{ background: "#09090b", padding: "120px 40px" }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 72 }}>
              <h2
                className="tts-slide"
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                }}
              >
                Pick your track.
              </h2>
              <p
                className="tts-fade"
                style={{
                  fontSize: 15,
                  color: "#a1a1aa",
                  marginTop: 10,
                  transitionDelay: "0.1s",
                }}
              >
                You can switch. Most people do two.
              </p>
            </div>

            {/* 3-column track cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
              }}
            >
              {TRACKS.map(
                (
                  {
                    num,
                    icon: Icon,
                    accent,
                    title,
                    sub,
                    tagline,
                    items,
                    for: forText,
                  },
                  i,
                ) => {
                  const animClass =
                    i === 0
                      ? "tts-from-left"
                      : i === 1
                        ? "tts-scale"
                        : "tts-from-right";
                  return (
                    <div
                      key={num}
                      className={`${animClass} tts-card`}
                      style={{
                        background: "#111113",
                        borderRadius: 16,
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderTop: `3px solid ${accent}`,
                        padding: "32px 28px",
                        display: "flex",
                        flexDirection: "column",
                        transitionDelay: `${i * 0.1}s`,
                      }}
                    >
                      {/* Header row: num + icon */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          marginBottom: 28,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 64,
                            fontWeight: 900,
                            color: accent,
                            opacity: 0.15,
                            letterSpacing: "-0.05em",
                            lineHeight: 1,
                            userSelect: "none",
                          }}
                        >
                          {num}
                        </div>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 11,
                            background: `${accent}15`,
                            border: `1px solid ${accent}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={18} color={accent} />
                        </div>
                      </div>

                      {/* Track name */}
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: accent,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                          opacity: 0.85,
                        }}
                      >
                        {sub}
                      </div>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: "#fff",
                          letterSpacing: "-0.03em",
                          lineHeight: 1.1,
                          marginBottom: 12,
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#a1a1aa",
                          lineHeight: 1.65,
                          marginBottom: 28,
                        }}
                      >
                        {tagline}
                      </div>

                      {/* Separator */}
                      <div
                        style={{
                          height: 1,
                          background: "rgba(255,255,255,0.06)",
                          marginBottom: 20,
                        }}
                      />

                      {/* Items */}
                      <ul
                        style={{
                          listStyle: "none",
                          margin: 0,
                          padding: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: 11,
                          flex: 1,
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
                              color: "#c4c4c8",
                            }}
                          >
                            <div
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: accent,
                                flexShrink: 0,
                                marginTop: 5,
                                opacity: 0.75,
                              }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* For */}
                      <div
                        style={{
                          marginTop: 24,
                          paddingTop: 20,
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#a1a1aa",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: 7,
                          }}
                        >
                          Best for
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "#a1a1aa",
                            lineHeight: 1.65,
                          }}
                        >
                          {forText}
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </section>

        {/* ── LEADERSHIP ── */}
        <section
          id="leadership"
          style={{ background: "#0c0c0f", padding: "120px 40px" }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              className="tts-slide"
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}
            >
              Built by builders
            </h2>
            <p
              className="tts-fade"
              style={{
                fontSize: 15,
                color: "#a1a1aa",
                marginBottom: 56,
                transitionDelay: "0.08s",
              }}
            >
              Two co-founders. One mission.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {FOUNDERS.map((f, i) => (
                <div
                  key={f.id}
                  className={i === 0 ? "tts-from-left" : "tts-from-right"}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div
                    style={{
                      background: "#111113",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Photo */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "3/2",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={f.headshot}
                        alt={f.name}
                        fill
                        sizes="50vw"
                        style={{
                          objectFit: "cover",
                          objectPosition: f.position,
                        }}
                        priority
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.1) 50%, transparent 100%)",
                        }}
                      />
                      <div
                        style={{ position: "absolute", bottom: 20, left: 20 }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: f.accent,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            marginBottom: 4,
                            opacity: 0.9,
                          }}
                        >
                          {f.role} · {f.focus}
                        </div>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 800,
                            color: "#fff",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {f.name}
                        </div>
                      </div>
                    </div>
                    {/* Details */}
                    <div style={{ padding: "20px 24px 24px" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 9,
                          marginBottom: 20,
                        }}
                      >
                        {f.owns.map((item) => (
                          <div
                            key={item}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 3,
                                height: 3,
                                borderRadius: "50%",
                                background: f.accent,
                                flexShrink: 0,
                                marginTop: 7,
                                opacity: 0.7,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 13,
                                color: "#a1a1aa",
                                lineHeight: 1.6,
                              }}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                      <a
                        href={f.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          fontWeight: 600,
                          color: f.accent,
                          textDecoration: "none",
                          transition: "opacity 0.15s",
                          opacity: 0.8,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.opacity =
                            "1";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLAnchorElement).style.opacity =
                            "0.8";
                        }}
                      >
                        View profile <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOIN ── */}
        <section
          id="join"
          style={{ background: "#09090b", padding: "120px 40px" }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 400px",
                gap: 80,
                alignItems: "start",
              }}
            >
              {/* Left: CTA copy */}
              <div>
                <h2
                  className="tts-slide"
                  style={{
                    fontSize: "clamp(28px, 4vw, 52px)",
                    fontWeight: 900,
                    color: "#fff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                    marginBottom: 20,
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
                    color: "#d4d4d8",
                    lineHeight: 1.8,
                    marginBottom: 44,
                    maxWidth: 480,
                    transitionDelay: "0.08s",
                  }}
                >
                  No waitlist. No interview. No experience required. Show up,
                  pick a track, and start building.
                </p>

                {/* Both CTAs */}
                <div
                  className="tts-fade"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 48,
                    maxWidth: 420,
                    transitionDelay: "0.14s",
                  }}
                >
                  <a
                    href={APPLICATION_URL}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: "#CC0000",
                      border: "none",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      boxShadow: "0 4px 20px rgba(204,0,0,0.25)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "#aa0000";
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "#CC0000";
                      (e.currentTarget as HTMLAnchorElement).style.transform =
                        "translateY(0)";
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        Student Application
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.7)",
                          marginTop: 1,
                        }}
                      >
                        Any major, any year
                      </div>
                    </div>
                    <ArrowRight size={16} />
                  </a>

                  <a
                    href={PARTNERSHIP_URL}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      borderRadius: 12,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#e4e4e7",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "rgba(255,255,255,0.3)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "#fff";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "rgba(255,255,255,0.15)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "#e4e4e7";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        Work with TTS
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#a1a1aa",
                          marginTop: 1,
                        }}
                      >
                        Organizations and startups
                      </div>
                    </div>
                    <ArrowRight size={16} />
                  </a>
                </div>

                {/* Checklist */}
                <div
                  className="tts-fade"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    transitionDelay: "0.22s",
                  }}
                >
                  {[
                    "Join any week this semester",
                    "Pick a track or try all three",
                    "Work on live projects from day one",
                    "No dues, no gatekeeping, no nonsense",
                  ].map((item) => (
                    <div
                      key={item}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <Check
                        size={14}
                        color="#CC0000"
                        strokeWidth={2.5}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 14, color: "#a1a1aa" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: email capture */}
              <div
                className="tts-perspective"
                style={{ paddingTop: 8, transitionDelay: "0.15s" }}
              >
                <div
                  style={{
                    background: "#111113",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.07)",
                    padding: "32px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "rgba(204,0,0,0.1)",
                        border: "1px solid rgba(204,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={16} color="#CC0000" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        Not ready yet?
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#a1a1aa",
                          marginTop: 2,
                        }}
                      >
                        Get notified when the next session starts.
                      </div>
                    </div>
                  </div>

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
                        gap: 8,
                      }}
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        disabled={emailLoading}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: 10,
                          background: "#0d0d10",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#fff",
                          fontSize: 14,
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
                          ).style.borderColor = "rgba(255,255,255,0.08)";
                        }}
                      />
                      <button
                        type="submit"
                        disabled={emailLoading}
                        style={{
                          padding: "11px",
                          borderRadius: 10,
                          background: "rgba(204,0,0,0.1)",
                          border: "1px solid rgba(204,0,0,0.2)",
                          color: "#CC0000",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: emailLoading ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                        }}
                        onMouseEnter={(e) => {
                          if (!emailLoading) {
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "rgba(204,0,0,0.18)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "rgba(204,0,0,0.1)";
                        }}
                      >
                        {emailLoading ? (
                          <>
                            <div
                              style={{
                                width: 12,
                                height: 12,
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
                        padding: "20px 16px",
                        borderRadius: 10,
                        background: "rgba(255,204,0,0.05)",
                        border: "1px solid rgba(255,204,0,0.15)",
                        textAlign: "center",
                      }}
                    >
                      <Check
                        size={20}
                        color="#FFCC00"
                        style={{ margin: "0 auto 10px", display: "block" }}
                      />
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#fff",
                          marginBottom: 4,
                        }}
                      >
                        You&apos;re on the list.
                      </div>
                      <div style={{ fontSize: 12, color: "#a1a1aa" }}>
                        We&apos;ll be in touch.
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
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "24px 40px",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#a1a1aa",
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: "rgba(204,0,0,0.08)",
                  border: "1px solid rgba(204,0,0,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={8} color="#CC0000" />
              </div>
              Trojan Technology Solutions · USC
            </div>
            <div style={{ fontSize: 11, color: "#a1a1aa" }}>
              {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
