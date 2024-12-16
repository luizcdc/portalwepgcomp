"use client";

import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useEffect, useState } from "react";

import "./style.scss";
import { useOrientacao } from "@/hooks/useOrientacao";
import { useEdicao } from "@/hooks/useEdicao";

export default function OrientacoesAutores() {
  const { Edicao } = useEdicao();

  const { putOrientacao, orientacoes } = useOrientacao();

  const [content, setContent] = useState(orientacoes?.authorGuidance || "");

  const handleEditOrientacao = () => {
    const idOrientacao = orientacoes?.id;

    if (idOrientacao) {
      putOrientacao(idOrientacao, {
        eventEditionId: Edicao?.id ?? "",
        authorGuidance: content,
      });
    }
  };

  useEffect(() => {
    setContent(orientacoes?.authorGuidance || "");
  }, [orientacoes?.authorGuidance]);

  return (
    <div className="orientacoes">
      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
        handleEditField={handleEditOrientacao}
      />
    </div>
  );
}
