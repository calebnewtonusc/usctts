"use client";

import dynamic from "next/dynamic";

const VisionWeb = dynamic(() => import("@/components/VisionWeb"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        color: "#52525b",
        fontSize: 14,
      }}
    >
      Loading VisionWeb...
    </div>
  ),
});

export default function VisionPage() {
  return <VisionWeb />;
}
