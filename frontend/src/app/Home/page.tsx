"use client";

import Carousel from "@/components/Carousel/Carousel";
import LocalEvento from "@/components/LocalEvento";
import Organizacao from "@/components/Organizacao";
import Orientacao from "@/components/Orientacao";
import Realizacao from "@/components/Realizacao/Realizacao";
import ScheduleSection from "@/components/ScheduleSection";

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
