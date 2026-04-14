import { notFound } from "next/navigation";
import { SlideDeck } from "@/components/meetings/SlideDeck";
import { getMeeting, meetingSlugs } from "@/lib/meetings";

export function generateStaticParams() {
  return meetingSlugs().map((slug) => ({ slug }));
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meeting = getMeeting(slug);
  if (!meeting) notFound();
  return <SlideDeck meeting={meeting} />;
}
