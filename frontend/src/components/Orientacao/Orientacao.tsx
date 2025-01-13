"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import "./style.scss";

import { useOrientacao } from "@/hooks/useOrientacao";

import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function Orientacao() {
  const { postOrientacao, putOrientacao, getOrientacoes, orientacoes } =
    useOrientacao();

  const [content, setContent] = useState(orientacoes?.summary || "");

  const handleEditOrientacao = () => {
    const idOrientacao = orientacoes?.id;
    const eventEditionId = getEventEditionIdStorage();

    if (idOrientacao) {
      putOrientacao(idOrientacao, {
        eventEditionId: eventEditionId ?? "",
        summary: content,
      });
    } else {
      postOrientacao({
        eventEditionId: eventEditionId ?? "",
        summary: content,
      });
    }
  };

  useEffect(() => {
    getOrientacoes();
  }, []);

  useEffect(() => {
    setContent(orientacoes?.summary || "");
  }, [orientacoes?.summary]);

  return (
    <div id="Orientacao">
      <div className="text-white text-center display-4 fs-1 fw-bold orientacao-titulo">
        Orientações
      </div>

      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
        handleEditField={handleEditOrientacao}
      />

      <Link className={"orientacao-link"} href="/orientacoes">
        Ver todas as orientações
      </Link>
    </div>
  );
}
