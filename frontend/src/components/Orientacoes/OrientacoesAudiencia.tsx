"use client";

import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useEffect, useState } from "react";

import "./style.scss";
import { useOrientacao } from "@/hooks/useOrientacao";

import { useEdicao } from "@/hooks/useEdicao";

export default function OrientacoesAudiencia() {
  const { putOrientacao, orientacoes } = useOrientacao();
  const { Edicao } = useEdicao();

  const [content, setContent] = useState(orientacoes?.audienceGuidance || "");

  const handleEditOrientacao = () => {
    const idOrientacao = orientacoes?.id;

    if (idOrientacao) {
      putOrientacao(idOrientacao, {
        eventEditionId: Edicao?.id ?? "",
        audienceGuidance: content,
      });
    }
  };

  useEffect(() => {
    setContent(orientacoes?.audienceGuidance || "");
  }, [orientacoes?.audienceGuidance]);

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
