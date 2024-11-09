"use client";

import Banner from "@/components/UI/Banner";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}
    >
      <Banner title="Orientações" />
    </div>
  );
}