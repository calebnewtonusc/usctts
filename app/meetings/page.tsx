import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import { MEETINGS } from "@/lib/meetings";

export default function MeetingsIndexPage() {
  const meetings = [...MEETINGS].sort((a, b) => b.number - a.number);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(204,0,0,0.16), transparent 60%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-24">
        <div className="mb-12 sm:mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">
            Internal
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            Meetings
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            Slides, notes, and next steps from every TTS meeting. Newest first.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {meetings.map((m) => (
            <Link
              key={m.slug}
              href={`/meetings/${m.slug}`}
              className="group relative block bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl p-5 sm:p-7 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-8">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border"
                      style={{
                        color: m.accent,
                        borderColor: `${m.accent}55`,
                        background: `${m.accent}14`,
                      }}
                    >
                      Meeting {String(m.number).padStart(2, "0")}
                    </span>
                    <StatusPill status={m.status} />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
                    {m.title}
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-4">
                    {m.summary}
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-zinc-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" aria-hidden />
                      {m.dateLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden />
                      {m.timeLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" aria-hidden />
                      {m.location}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-center flex items-center gap-2 text-sm text-zinc-400 group-hover:text-white transition-colors">
                  <span className="font-medium">Open slides</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            ← Back to site
          </Link>
          <span>Cabinet eyes only</span>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "upcoming" | "live" | "past" }) {
  const styles = {
    upcoming: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    live: "bg-red-500/10 text-red-400 border-red-500/30",
    past: "bg-white/5 text-zinc-500 border-white/10",
  } as const;
  const label = {
    upcoming: "Upcoming",
    live: "Live now",
    past: "Past",
  } as const;
  return (
    <span
      className={`text-[10px] sm:text-xs uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border ${styles[status]}`}
    >
      {status === "live" && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse mr-1.5 align-middle" />
      )}
      {label[status]}
    </span>
  );
}
