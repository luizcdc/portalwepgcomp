"use client";

import { useEffect, useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";

import "./style.scss";
import { SessoesMock } from "@/mocks/Sessoes";
import { useOrientacao } from "@/hooks/useOrientacao";

export default function OrientacoesAvaliadores() {
  const { eventEditionId } = SessoesMock;
  const { putOrientacao, orientacoes } = useOrientacao();

  const [content, setContent] = useState(orientacoes?.reviewerGuidance || "");

  const handleEditOrientacao = () => {
    const idOrientacao = orientacoes?.id;

    if (idOrientacao) {
      putOrientacao(idOrientacao, {
        eventEditionId,
        reviewerGuidance: content,
      });
    } else {
      console.log("Orientação não encontrada");
    }
  };

  useEffect(() => {
    setContent(orientacoes?.reviewerGuidance || "");
  }, [orientacoes?.reviewerGuidance]);

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
