"use client";

import { useEdicao } from "@/hooks/useEdicao";
import { SessoesMock } from "@/mocks/Sessoes";
import { useEffect } from "react";

import Carousel from "@/components/Carousel/Carousel";
import LocalEvento from "@/components/LocalEvento/LocalEvento";
import Organizacao from "@/components/Organizacao/Organizacao";
import Orientacao from "@/components/Orientacao/Orientacao";
import Realizacao from "@/components/Realizacao/Realizacao";
import ScheduleSection from "@/components/ScheduleSection/ScheduleSection";

export default function Home() {
  const { eventEditionId } = SessoesMock;
  const { getEdicaoById } = useEdicao();

  useEffect(() => {
    getEdicaoById(eventEditionId);
  }, []);

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
