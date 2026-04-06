import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trojan Technology Solutions | USC Builder Club",
  description:
    "USC's AI builder club. Workshops, client work, and speaker nights open to every major. No experience required. No gatekeeping.",
  openGraph: {
    title: "Trojan Technology Solutions",
    description:
      "USC's AI builder club. Open to every major. No experience required. No gatekeeping.",
    url: "https://trojantechsolutions.com",
    siteName: "Trojan Technology Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trojan Technology Solutions",
    description:
      "USC's AI builder club. Open to every major. No experience required.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className={`${inter.className} min-h-full bg-zinc-950 antialiased`}>
        {children}
        <Toaster theme="dark" />
        <Analytics />
      </body>
    </html>
  );
}
