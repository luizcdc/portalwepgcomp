"use client";

import OrientacoesAudiencia from "@/components/Orientacoes/OrientacoesAudiencia";
import OrientacoesAutores from "@/components/Orientacoes/OrientacoesAutores";
import OrientacoesAvaliadores from "@/components/Orientacoes/OrientacoesAvaliadores";
import Banner from "@/components/UI/Banner";
import { useState } from "react";

export default function Orientacoes() {
  const [setion, setSetion] = useState<number>(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}
    >
      <Banner title="Orientações" />
      <div className="button">
        <div className={setion == 0 ? "buttonTrue" : "buttonFalse"} onClick={() => setSetion(0)}>Autores</div>
        <div className={setion == 1 ? "buttonTrue" : "buttonFalse"} onClick={() => setSetion(1)}>Avaliadores</div>
        <div className={setion == 2 ? "buttonTrue" : "buttonFalse"} onClick={() => setSetion(2)}>Audiência</div>
      </div>
      {setion == 0 ? <OrientacoesAudiencia /> : ''}
      {setion == 1 ? <OrientacoesAutores /> : ''}
      {setion == 2 ? <OrientacoesAvaliadores /> : ''}
    </div>
  );
}