"use client";

import { useEffect, useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";

import "./style.scss";

import { useOrientacao } from "@/hooks/useOrientacao";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function OrientacoesAvaliadores() {
  const { putOrientacao, orientacoes } = useOrientacao();

  const [content, setContent] = useState(orientacoes?.reviewerGuidance || "");

  const handleEditOrientacao = () => {
    const idOrientacao = orientacoes?.id;
    const eventEditionId = getEventEditionIdStorage();

    if (idOrientacao) {
      putOrientacao(idOrientacao, {
        eventEditionId: eventEditionId ?? "",
        reviewerGuidance: content,
      });
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
