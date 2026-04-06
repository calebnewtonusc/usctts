"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PinchDetector } from "@/hooks/usePinch";
import { toast } from "sonner";

// Landmark indices for MediaPipe Hands
const FINGER_TIPS = [4, 8, 12, 16, 20];
const FINGER_NAMES = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
const CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
];

interface Landmark {
  x: number;
  y: number;
  z: number;
}
interface HandResult {
  landmarks: Landmark[];
  handedness: string;
  pinchRatio: number;
  pinchState: string;
}

interface ClickSpark {
  id: number;
  x: number;
  y: number;
  born: number;
}

export default function HandsWeb() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const handsRef = useRef<{
    send: (i: { image: HTMLVideoElement }) => Promise<void>;
    close: () => void;
  } | null>(null);
  const pinchLeft = useRef(new PinchDetector());
  const pinchRight = useRef(new PinchDetector());
  const streamRef = useRef<MediaStream | null>(null);
  const sendingRef = useRef(false);
  const handsDataRef = useRef<HandResult[]>([]);
  const sparksRef = useRef<ClickSpark[]>([]);
  const sparkIdRef = useRef(0);

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hands, setHands] = useState<HandResult[]>([]);
  const [fps, setFps] = useState(0);
  const [pinchEvents, setPinchEvents] = useState<string[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const fpsFrames = useRef(0);
  const fpsLast = useRef(performance.now());

  const logEvent = useCallback((msg: string) => {
    setPinchEvents((prev) => [msg, ...prev].slice(0, 8));
  }, []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Mirror the video
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.restore();

    // Dark overlay for visibility
    ctx.fillStyle = "rgba(9,9,11,0.35)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const data = handsDataRef.current;
    const now = performance.now();

    for (const hand of data) {
      const lm = hand.landmarks;
      const isPinched = ["pinching", "holding", "dragging"].includes(
        hand.pinchState,
      );
      const handColor = hand.handedness === "left" ? "#a78bfa" : "#34d399";

      // Mirror landmark x coords
      const mx = (x: number) => (1 - x) * canvas.width;
      const my = (y: number) => y * canvas.height;

      // Draw connections (skeleton)
      if (showSkeleton) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = isPinched ? `${handColor}cc` : `${handColor}55`;
        for (const [a, b] of CONNECTIONS) {
          ctx.beginPath();
          ctx.moveTo(mx(lm[a].x), my(lm[a].y));
          ctx.lineTo(mx(lm[b].x), my(lm[b].y));
          ctx.stroke();
        }
      }

      // Draw landmarks
      if (showLandmarks) {
        for (let i = 0; i < lm.length; i++) {
          const isTip = FINGER_TIPS.includes(i);
          const isThumb = i === 4;
          const isIndex = i === 8;
          const px = mx(lm[i].x);
          const py = my(lm[i].y);

          ctx.beginPath();
          ctx.arc(px, py, isTip ? 7 : 4, 0, Math.PI * 2);
          ctx.fillStyle =
            (isThumb || isIndex) && isPinched
              ? "#fbbf24"
              : isTip
                ? handColor
                : `${handColor}99`;
          ctx.fill();

          // Pulsing ring on thumb + index when close to pinch
          if ((isThumb || isIndex) && hand.pinchRatio < 0.55) {
            const progress = 1 - Math.min(hand.pinchRatio / 0.55, 1);
            ctx.beginPath();
            ctx.arc(px, py, 7 + progress * 10, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(251,191,36,${progress * 0.7})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      // Pinch midpoint indicator
      if (isPinched) {
        const thumb = lm[4];
        const index = lm[8];
        const cx = mx((thumb.x + index.x) / 2);
        const cy = my((thumb.y + index.y) / 2);

        // Glowing dot
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
        grad.addColorStop(0, "rgba(251,191,36,0.9)");
        grad.addColorStop(1, "rgba(251,191,36,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Label
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(hand.pinchState.toUpperCase(), cx, cy - 24);
      }

      // Wrist label
      ctx.fillStyle = handColor;
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = hand.handedness === "left" ? "left" : "right";
      const wx = mx(lm[0].x);
      const wy = my(lm[0].y);
      ctx.fillText(
        `${hand.handedness === "left" ? "L" : "R"} ${Math.round(hand.pinchRatio * 100)}%`,
        hand.handedness === "left" ? wx + 10 : wx - 10,
        wy + 20,
      );
    }

    // Draw click sparks
    sparksRef.current = sparksRef.current.filter((s) => now - s.born < 600);
    for (const spark of sparksRef.current) {
      const age = (now - spark.born) / 600;
      const r = age * 40;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251,191,36,${1 - age})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [showSkeleton, showLandmarks]);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
      return;
    }

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    // Load MediaPipe Hands
    await new Promise<void>((resolve, reject) => {
      if ((window as unknown as Record<string, unknown>).Hands) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
      s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load @mediapipe/hands"));
      document.head.appendChild(s);
    });

    type HandLandmark = { x: number; y: number; z: number };
    type HandsResults = {
      multiHandLandmarks?: HandLandmark[][];
      multiHandedness?: { label: string; score: number }[];
    };
    type HandsInstance = {
      setOptions: (o: Record<string, unknown>) => void;
      onResults: (cb: (r: HandsResults) => void) => void;
      send: (i: { image: HTMLVideoElement }) => Promise<void>;
      close: () => void;
    };

    const HandsCtor = (
      window as unknown as {
        Hands: new (o: Record<string, unknown>) => HandsInstance;
      }
    ).Hands;

    const hi = new HandsCtor({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    hi.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.6,
    });

    hi.onResults((results: HandsResults) => {
      const now = performance.now();
      fpsFrames.current++;
      if (now - fpsLast.current >= 1000) {
        setFps(fpsFrames.current);
        fpsFrames.current = 0;
        fpsLast.current = now;
      }

      if (
        !results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0
      ) {
        pinchLeft.current.update(null, now);
        pinchRight.current.update(null, now);
        handsDataRef.current = [];
        setHands([]);
        return;
      }

      const newHands: HandResult[] = [];

      results.multiHandLandmarks.forEach((lm, i) => {
        const side =
          results.multiHandedness?.[i]?.label?.toLowerCase() ?? "right";
        const detector =
          side === "left" ? pinchLeft.current : pinchRight.current;
        const result = detector.update(lm, now);

        if (result.changed && result.state === "released" && result.center) {
          const canvas = canvasRef.current;
          if (canvas) {
            const sx = (1 - result.center.x) * canvas.offsetWidth;
            const sy = result.center.y * canvas.offsetHeight;
            sparksRef.current.push({
              id: sparkIdRef.current++,
              x: sx * (canvas.width / canvas.offsetWidth),
              y: sy * (canvas.height / canvas.offsetHeight),
              born: now,
            });
          }
          logEvent(`${side === "left" ? "L" : "R"} pinch click`);
        }
        if (result.changed && result.state === "pinching") {
          logEvent(`${side === "left" ? "L" : "R"} pinch start`);
        }
        if (result.state === "holding") {
          logEvent(
            `${side === "left" ? "L" : "R"} hold ${Math.round(result.heldMs)}ms`,
          );
        }

        newHands.push({
          landmarks: lm as Landmark[],
          handedness: side,
          pinchRatio: result.ratio,
          pinchState: result.state,
        });
      });

      handsDataRef.current = newHands;
      setHands([...newHands]);
    });

    handsRef.current = hi;

    const video = videoRef.current!;
    function loop() {
      animRef.current = requestAnimationFrame(loop);
      drawFrame();
      if (video.readyState < 2 || sendingRef.current) return;
      sendingRef.current = true;
      hi.send({ image: video })
        .then(() => {
          sendingRef.current = false;
        })
        .catch(() => {
          sendingRef.current = false;
        });
    }
    loop();

    setStarted(true);
    setLoading(false);
    toast.success("Hand tracking active");
  }, [drawFrame, logEvent]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      handsRef.current?.close();
    };
  }, []);

  // Re-draw when toggles change (without waiting for next frame)
  useEffect(() => {
    if (started) drawFrame();
  }, [showSkeleton, showLandmarks, started, drawFrame]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#09090b",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(139,92,246,0.15))",
              border: "1px solid rgba(168,85,247,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c084fc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 11V6a2 2 0 0 0-4 0v5" />
              <path d="M14 10V4a2 2 0 0 0-4 0v6" />
              <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "-0.01em",
              }}
            >
              HandsWeb
            </div>
            <div style={{ color: "#52525b", fontSize: 11 }}>
              MediaPipe hand tracking dev sandbox
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {started && (
            <>
              {/* FPS badge */}
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  background:
                    fps > 20 ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${fps > 20 ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
                  color: fps > 20 ? "#34d399" : "#f87171",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {fps} fps
              </div>

              {/* Hand count */}
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  background:
                    hands.length > 0
                      ? "rgba(168,85,247,0.1)"
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${hands.length > 0 ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.08)"}`,
                  color: hands.length > 0 ? "#c084fc" : "#52525b",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {hands.length === 0
                  ? "No hands"
                  : `${hands.length} hand${hands.length > 1 ? "s" : ""}`}
              </div>

              {/* Toggles */}
              {[
                ["Skeleton", showSkeleton, () => setShowSkeleton((s) => !s)],
                ["Landmarks", showLandmarks, () => setShowLandmarks((s) => !s)],
              ].map(([label, on, toggle]) => (
                <button
                  key={label as string}
                  onClick={toggle as () => void}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: `1px solid ${on ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                    background: on
                      ? "rgba(99,102,241,0.12)"
                      : "rgba(255,255,255,0.04)",
                    color: on ? "#818cf8" : "#52525b",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {label as string}
                </button>
              ))}
            </>
          )}

          <a
            href="/vision"
            style={{
              padding: "6px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#a1a1aa",
              fontSize: 12,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.15s",
            }}
          >
            Vision page
          </a>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Canvas */}
        <div style={{ flex: 1, position: "relative" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: "absolute",
              opacity: 0,
              pointerEvents: "none",
              width: 1,
              height: 1,
            }}
          />

          {!started ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {error ? (
                <div
                  style={{
                    textAlign: "center",
                    maxWidth: 400,
                    padding: "0 24px",
                  }}
                >
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      marginBottom: 16,
                    }}
                  >
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: 12,
                        fontWeight: 600,
                        margin: "0 0 4px",
                      }}
                    >
                      Camera error
                    </p>
                    <p style={{ color: "#a1a1aa", fontSize: 12, margin: 0 }}>
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    style={btnStyle("#3f3f46", "#fff")}
                  >
                    Reload
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 28,
                      background:
                        "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(139,92,246,0.1))",
                      border: "1px solid rgba(168,85,247,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
                      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
                      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                    </svg>
                  </div>
                  <h1
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      fontWeight: 700,
                      margin: "0 0 8px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Hand Tracking Sandbox
                  </h1>
                  <p
                    style={{
                      color: "#71717a",
                      fontSize: 13,
                      margin: "0 0 28px",
                      lineHeight: 1.6,
                    }}
                  >
                    Real-time 21-landmark skeleton. Pinch detection, drag, hold.
                    <br />
                    Runs entirely in your browser via MediaPipe.
                  </p>
                  <button
                    onClick={start}
                    disabled={loading}
                    style={{
                      padding: "14px 32px",
                      borderRadius: 16,
                      border: "none",
                      background: loading
                        ? "rgba(168,85,247,0.3)"
                        : "linear-gradient(135deg, #a855f7, #8b5cf6)",
                      boxShadow: loading
                        ? "none"
                        : "0 4px 24px rgba(168,85,247,0.4)",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {loading ? "Starting…" : "Start Hand Tracking"}
                  </button>
                  <p style={{ color: "#3f3f46", fontSize: 11, marginTop: 14 }}>
                    Camera access required. Your feed never leaves your browser.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </div>

        {/* Right panel */}
        {started && (
          <div
            style={{
              width: 260,
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* Hand cards */}
            <div
              style={{
                padding: 16,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  color: "#52525b",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                }}
              >
                Detected hands
              </p>
              {hands.length === 0 ? (
                <div
                  style={{
                    padding: "20px 0",
                    textAlign: "center",
                    color: "#3f3f46",
                    fontSize: 12,
                  }}
                >
                  Show your hands
                </div>
              ) : (
                hands.map((hand, i) => {
                  const color =
                    hand.handedness === "left" ? "#a78bfa" : "#34d399";
                  const isPinched = [
                    "pinching",
                    "holding",
                    "dragging",
                  ].includes(hand.pinchState);
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: 12,
                        border: `1px solid ${isPinched ? `${color}40` : "rgba(255,255,255,0.06)"}`,
                        background: isPinched
                          ? `${color}08`
                          : "rgba(255,255,255,0.02)",
                        padding: "12px",
                        marginBottom: 8,
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ color, fontSize: 12, fontWeight: 700 }}>
                          {hand.handedness === "left" ? "Left" : "Right"} hand
                        </span>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: isPinched
                              ? "rgba(251,191,36,0.12)"
                              : "rgba(255,255,255,0.04)",
                            border: `1px solid ${isPinched ? "rgba(251,191,36,0.25)" : "rgba(255,255,255,0.08)"}`,
                            color: isPinched ? "#fbbf24" : "#52525b",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {hand.pinchState}
                        </span>
                      </div>
                      {/* Pinch ratio bar */}
                      <div style={{ marginBottom: 6 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ color: "#52525b", fontSize: 10 }}>
                            Pinch ratio
                          </span>
                          <span
                            style={{
                              color: "#a1a1aa",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            {Math.round(hand.pinchRatio * 100)}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            borderRadius: 2,
                            background: "rgba(255,255,255,0.06)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min(hand.pinchRatio * 100, 100)}%`,
                              background: isPinched
                                ? "#fbbf24"
                                : hand.pinchRatio < 0.45
                                  ? "#34d399"
                                  : color,
                              borderRadius: 2,
                              transition: "width 0.05s",
                            }}
                          />
                        </div>
                      </div>
                      {/* Finger tips */}
                      <div style={{ display: "flex", gap: 4 }}>
                        {FINGER_TIPS.map((tipIdx, fi) => {
                          const lm = hand.landmarks[tipIdx];
                          const isActive = fi === 0 || fi === 1; // thumb + index most relevant
                          return (
                            <div
                              key={fi}
                              title={FINGER_NAMES[fi]}
                              style={{
                                flex: 1,
                                height: 4,
                                borderRadius: 2,
                                background:
                                  isActive && isPinched
                                    ? "#fbbf24"
                                    : lm.z < -0.05
                                      ? color
                                      : "rgba(255,255,255,0.08)",
                                transition: "background 0.1s",
                              }}
                            />
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                        {FINGER_NAMES.map((name) => (
                          <div
                            key={name}
                            style={{
                              flex: 1,
                              color: "#3f3f46",
                              fontSize: 8,
                              textAlign: "center",
                            }}
                          >
                            {name[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Event log */}
            <div style={{ flex: 1, padding: 16, overflow: "hidden" }}>
              <p
                style={{
                  color: "#52525b",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                }}
              >
                Event log
              </p>
              {pinchEvents.length === 0 ? (
                <p style={{ color: "#3f3f46", fontSize: 12 }}>
                  Pinch to see events
                </p>
              ) : (
                pinchEvents.map((ev, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "6px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      color: i === 0 ? "#e4e4e7" : "#52525b",
                      fontSize: 11,
                      fontWeight: i === 0 ? 600 : 400,
                      transition: "color 0.3s",
                    }}
                  >
                    {ev}
                  </div>
                ))
              )}
            </div>

            {/* Landmark reference */}
            <div
              style={{
                padding: 16,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  color: "#52525b",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  margin: "0 0 8px",
                  textTransform: "uppercase",
                }}
              >
                Key landmarks
              </p>
              {[
                ["0", "Wrist"],
                ["4", "Thumb tip"],
                ["8", "Index tip"],
                ["12", "Middle tip"],
                ["16", "Ring tip"],
                ["20", "Pinky tip"],
              ].map(([idx, name]) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "3px 0",
                  }}
                >
                  <span style={{ color: "#52525b", fontSize: 11 }}>{name}</span>
                  <span
                    style={{
                      color: "#3f3f46",
                      fontSize: 11,
                      fontFamily: "monospace",
                    }}
                  >
                    #{idx}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    padding: "10px 24px",
    borderRadius: 12,
    border: "none",
    background: bg,
    color,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  };
}
