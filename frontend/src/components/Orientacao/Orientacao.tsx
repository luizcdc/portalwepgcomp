"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import "./style.scss";

import { useOrientacao } from "@/hooks/useOrientacao";
import { useEdicao } from "@/hooks/useEdicao";

export default function Orientacao() {
  const { postOrientacao, putOrientacao, getOrientacoes, orientacoes } =
    useOrientacao();

  const { Edicao } = useEdicao();

  const [content, setContent] = useState(orientacoes?.summary || "");

  const handleEditOrientacao = () => {
    const idOrientacao = orientacoes?.id;

    if (idOrientacao) {
      putOrientacao(idOrientacao, {
        eventEditionId: Edicao?.id ?? "",
        summary: content,
      });
    } else {
      postOrientacao({ eventEditionId: Edicao?.id ?? "", summary: content });
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

      <Link className={"orientacao-link"} href="/Orientacoes">
        Ver todas as orientações
      </Link>
    </div>
  );
}
