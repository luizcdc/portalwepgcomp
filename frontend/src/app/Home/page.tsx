"use client";

import Carousel from "@/components/Carousel/Carousel";
import LocalEvento from "@/components/LocalEvento";
import Organizacao from "@/components/Organizacao/Organizacao";
import Orientacao from "@/components/Orientacao/Orientacao";
import Realizacao from "@/components/Realizacao";
import ScheduleSection from "@/components/ScheduleSection/ScheduleSection";

export default function Home() {
  return (
    <div className="d-flex flex-column">
      <Carousel />
      <ScheduleSection />
      <Orientacao />
      <Organizacao />
      <LocalEvento />
      <Realizacao />
    </div>
  );
}
