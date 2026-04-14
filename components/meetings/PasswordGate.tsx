"use client";

import { useEffect, useState } from "react";
import { Lock, ArrowRight } from "lucide-react";

const STORAGE_KEY = "tts-meetings-unlocked";
const ANSWER = "gravity";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      setUnlocked(stored === "1");
    } catch {
      setUnlocked(false);
    }
  }, []);

  const attempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === ANSWER) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (unlocked === null) {
    return <div className="min-h-screen bg-zinc-950" aria-hidden />;
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(204,0,0,0.18), transparent 60%), radial-gradient(ellipse at bottom, rgba(255,204,0,0.08), transparent 55%)",
        }}
      />
      <form
        onSubmit={attempt}
        className="relative z-10 w-full max-w-md"
        autoComplete="off"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
            <Lock className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              TTS Meetings
            </div>
            <div className="text-sm text-zinc-300">Members only</div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
          Enter the password
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
          Slides from every meeting live here. Ask a cabinet member if you need
          the password.
        </p>

        <label htmlFor="pw" className="sr-only">
          Password
        </label>
        <div className="flex gap-2">
          <input
            id="pw"
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Password"
            autoFocus
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/25 cursor-pointer"
          >
            <span className="hidden sm:inline">Unlock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            Not quite. Try again.
          </p>
        )}

        <div className="mt-10 pt-6 border-t border-white/5 text-xs text-zinc-600">
          Trojan Technology Solutions
        </div>
      </form>
    </div>
  );
}
