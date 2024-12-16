"use client";

import OrientacoesAudiencia from "@/components/Orientacoes/OrientacoesAudiencia";
import OrientacoesAutores from "@/components/Orientacoes/OrientacoesAutores";
import OrientacoesAvaliadores from "@/components/Orientacoes/OrientacoesAvaliadores";
import Banner from "@/components/UI/Banner";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useOrientacao } from "@/hooks/useOrientacao";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useEdicao } from "@/hooks/useEdicao";

export default function Orientacoes() {
  const [setion, setSetion] = useState<number>(0);
  const { user } = useContext(AuthContext);

  const isAdm = user?.level === "Superadmin";

  const { getOrientacoes, orientacoes } = useOrientacao();
  const { getEdicaoByYear } = useEdicao();

  useEffect(() => {
    getOrientacoes();
    getEdicaoByYear("2024");
  }, []);

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
        <div
          className={setion == 0 ? "buttonTrue" : "buttonFalse"}
          onClick={() => setSetion(0)}
        >
          Autores
        </div>
        <div
          className={setion == 1 ? "buttonTrue" : "buttonFalse"}
          onClick={() => setSetion(1)}
        >
          Avaliadores
        </div>
        <div
          className={setion == 2 ? "buttonTrue" : "buttonFalse"}
          onClick={() => setSetion(2)}
        >
          Audiência
        </div>
      </div>
      {!orientacoes?.id && isAdm ? (
        <div className="d-flex flex-column align-items-center justify-content-center p-3 mt-4 mb-5">
          <Image
            src="/assets/images/empty_box.svg"
            alt="Lista vazia"
            width={90}
            height={90}
          />
          <h4 className="empty-list mb-0">
            Você precisa criar o resumo das orientações na tela inicial para
            editar as orientações por perfil
          </h4>
        </div>
      ) : (
        <>
          {setion == 0 ? <OrientacoesAutores /> : ""}
          {setion == 1 ? <OrientacoesAvaliadores /> : ""}
          {setion == 2 ? <OrientacoesAudiencia /> : ""}
        </>
      )}
    </div>
  );
}
