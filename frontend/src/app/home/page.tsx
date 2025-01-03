"use client";

import Carousel from "@/components/Carousel/Carousel";
import LoadingPage from "@/components/LoadingPage";
import LocalEvento from "@/components/LocalEvento/LocalEvento";
import Organizacao from "@/components/Organizacao/Organizacao";
import Orientacao from "@/components/Orientacao/Orientacao";
import Realizacao from "@/components/Realizacao/Realizacao";
import ScheduleSection from "@/components/ScheduleSection/ScheduleSection";
import { useEdicao } from "@/hooks/useEdicao";
import { useEffect } from "react";

export default function Home() {
  const { getEdicaoByYear, loadingEdicao } = useEdicao();

  useEffect(() => {
    getEdicaoByYear("2024");
  }, []);

  return (
    <div className="d-flex flex-column">
      {loadingEdicao && <LoadingPage />}
      {!loadingEdicao && (
        <>
          <Carousel />
          <ScheduleSection />
          <Orientacao />
          <Organizacao />
          <LocalEvento />
          <Realizacao />
        </>
      )}
    </div>
  );
}
