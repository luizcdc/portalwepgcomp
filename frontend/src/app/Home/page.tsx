"use client";

import Carousel from "@/components/Carousel/Carousel";
import LocalEvento from "@/components/LocalEvento";
import Organizacao from "@/components/Organizacao";
import Orientacao from "@/components/Orientacao";
import Realizacao from "@/components/Realizacao";
import ScheduleSection from "@/components/ScheduleSection";
import SearchGroups from "@/components/SearchGroups";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}
    >
      <Carousel />
      <ScheduleSection />
      <Orientacao />
      <SearchGroups />
      <Organizacao />
      <LocalEvento />
      <Realizacao />
    </div>
  );
}
