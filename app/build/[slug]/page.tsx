import { notFound } from "next/navigation";
import { SlideDeck } from "@/components/meetings/SlideDeck";
import { buildSessionSlugs, getBuildSession } from "@/lib/build";

export function generateStaticParams() {
  return buildSessionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = getBuildSession(slug);
  if (!session) return {};

  return {
    title: `${session.title} | TTS Build`,
    description: session.summary,
  };
}

export default async function BuildSessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = getBuildSession(slug);
  if (!session) notFound();

  return (
    <SlideDeck
      meeting={session}
      backHref="/build"
      backLabel="Build hub"
      mobileBackLabel="Build"
      codePrefix="B"
    />
  );
}
