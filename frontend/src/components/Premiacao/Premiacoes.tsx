import Image from "next/image";
import { useEffect, useState } from "react";

import PremiacaoCategoria from "./PremiacaoCategoria";

import "./style.scss";
import { usePremiacao } from "@/hooks/usePremiacao";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function Premiacoes({
  categoria,
}: Readonly<{
  categoria: "banca" | "avaliadores" | "publico";
}>) {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    premiacaoListBanca,
    premiacaoListAudiencia,
    premiacaoListAvaliadores,
    getPremiacoesBanca,
    getPremiacoesAudiencia,
    getPremiacoesAvaliadores,
  } = usePremiacao();

  useEffect(() => {
    const eventEditionId = getEventEditionIdStorage();

    if (eventEditionId) {
      switch (categoria) {
        case "banca":
          getPremiacoesBanca(eventEditionId);
          break;
        case "publico":
          getPremiacoesAudiencia(eventEditionId);
          break;
        case "avaliadores":
          getPremiacoesAvaliadores(eventEditionId);
          break;
        default:
          break;
      }
    }
  }, [categoria]);

  const getAwards = () => {
    switch (categoria) {
      case "banca":
        return premiacaoListBanca;
      case "publico":
        return premiacaoListAudiencia;
      default:
        return [];
    }
  };

  return (
    <div className="d-flex flex-column premiacao-list">
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquise pelo nome da apresentação"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          className="btn btn-outline-secondary border border-0 search-button d-flex justify-content-center align-items-center"
          type="button"
          id="button-addon2"
        >
          <Image
            src="/assets/images/search.svg"
            alt="Search icon"
            width={24}
            height={24}
          />
        </button>
      </div>

      <PremiacaoCategoria
        categoria={categoria}
        premiacoes={getAwards()}
        searchValue={searchTerm}
        avaliadores={premiacaoListAvaliadores}
      />
    </div>
  );
}
