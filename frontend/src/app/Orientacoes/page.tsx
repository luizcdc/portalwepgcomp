"use client";

import OrientacoesAudiencia from "@/components/Orientacoes/OrientacoesAudiencia";
import OrientacoesAutores from "@/components/Orientacoes/OrientacoesAutores";
import OrientacoesAvaliadores from "@/components/Orientacoes/OrientacoesAvaliadores";
import Banner from "@/components/UI/Banner";

export default function Orientacoes() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "50px",
      }}
    >
      <Banner title="Orientações" />
      <OrientacoesAudiencia />
      <OrientacoesAutores />
      <OrientacoesAvaliadores />
    </div>
  );
}