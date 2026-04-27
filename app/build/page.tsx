import Link from "next/link";
import { ArrowRight, CheckCircle2, Code2 } from "lucide-react";
import {
  BUILD_SESSIONS,
  currentBuildSession,
  type BuildDeliverable,
  type BuildSession,
} from "@/lib/build";

export const metadata = {
  title: "Build Team | Trojan Technology Solutions",
  description:
    "Meeting slides and deliverables for the TTS Build Team.",
};

const statusLabel: Record<BuildDeliverable["status"], string> = {
  done: "Complete",
  before: "Before meeting",
  during: "During meeting",
  after: "After meeting",
};

const statusClass: Record<BuildDeliverable["status"], string> = {
  done: "border-white/10 text-zinc-400",
  before: "border-amber-400/25 text-amber-300",
  during: "border-red-400/25 text-red-300",
  after: "border-emerald-400/25 text-emerald-300",
};

const sessionStatusLabel: Record<BuildSession["status"], string> = {
  past: "Past",
  live: "Live",
  upcoming: "Upcoming",
};

const sessionStatusClass: Record<BuildSession["status"], string> = {
  past: "border-white/10 text-zinc-500",
  live: "border-emerald-400/25 text-emerald-300",
  upcoming: "border-amber-400/25 text-amber-300",
};

export default function BuildPage() {
  const sessions = [...BUILD_SESSIONS].sort((a, b) => a.number - b.number);
  const current = currentBuildSession;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(204,0,0,0.22), transparent 60%)",
        }}
      />

      {/* Nav */}
      <header className="relative z-10 border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-red-300">
              <Code2 className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="text-sm font-semibold text-white group-hover:text-zinc-300 transition-colors">
              TTS Build
            </span>
          </Link>
          <span className="text-xs text-zinc-600">usctts.com/build</span>
        </div>
      </header>

      {/* Current meeting hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-12 pt-14">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: current.accent }}
        >
          Current · Meeting {current.number}
        </p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {current.title.replace(/^Build Meeting \d+:\s*/, "")}
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-7 text-zinc-400">
          {current.summary}
        </p>
        <Link
          href={`/build/${current.slug}`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-black shadow-lg transition-colors"
          style={{ backgroundColor: current.accent }}
        >
          Open Meeting {current.number} slides
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      {/* Deliverables */}
      <section
        id="deliverables"
        className="relative z-10 mx-auto max-w-5xl border-t border-white/5 px-6 py-12"
      >
        <h2 className="mb-1 text-2xl font-semibold tracking-tight text-white">
          Deliverables
        </h2>
        <p className="mb-8 text-sm text-zinc-500">
          What everyone should walk away with from Meeting {current.number}.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {current.deliverables.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-snug text-white">
                  {item.title}
                </h3>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusClass[item.status]}`}
                >
                  {statusLabel[item.status]}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* All meetings */}
      <section
        id="sessions"
        className="relative z-10 mx-auto max-w-5xl border-t border-white/5 px-6 py-12 pb-24"
      >
        <h2 className="mb-1 text-2xl font-semibold tracking-tight text-white">
          All meetings
        </h2>
        <p className="mb-8 text-sm text-zinc-500">
          Every session, slides, and deliverables in one place.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {sessions.map((session) => (
            <article
              key={session.slug}
              className="flex flex-col rounded-3xl border border-white/8 bg-white/[0.03] p-6"
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: session.accent }}
                >
                  Meeting {session.number}
                </p>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${sessionStatusClass[session.status]}`}
                >
                  {sessionStatusLabel[session.status]}
                </span>
              </div>

              {/* Title + focus */}
              <h3 className="mb-2 text-lg font-semibold leading-snug tracking-tight text-white">
                {session.title.replace(/^Build Meeting \d+:\s*/, "")}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-zinc-500">
                {session.focus}
              </p>

              {/* Deliverables */}
              <ul className="mb-6 flex flex-col gap-2">
                {session.deliverables.map((d) => (
                  <li
                    key={d.title}
                    className="flex items-start gap-2 text-sm text-zinc-400"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      style={{ color: session.accent }}
                      aria-hidden
                    />
                    <span>{d.title}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                <Link
                  href={`/build/${session.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]"
                >
                  Open slides
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
