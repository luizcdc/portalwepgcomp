"use client";

import Image from "next/image";

import { useEdicao } from "@/hooks/useEdicao";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useState } from "react";
import { SessoesMock } from "@/mocks/Sessoes";

import "./style.scss";

export default function Realizacao() {
  const [content, setContent] = useState("");
  const { updateEdicao } = useEdicao();
  const { eventEditionId } = SessoesMock;

  const handleEditPartners = () => {
    updateEdicao(eventEditionId, { partnersText: content });
  };

  return (
    <div className="realizacao-home">
      <div className="realizacao-areas">
        <div className="title">Realização:</div>

        <div className="parceiros">
          <Image
            src={"/assets/images/logo_computacao.svg"}
            alt="Computação Logo"
            width={300}
            height={100}
            priority
          />
          <Image
            src={"/assets/images/logo_ufba.svg"}
            alt="UFBA Logo"
            width={300}
            height={100}
            priority
          />
        </div>
      </div>

      <div className="realizacao-areas">
        <div className="title">Apoio:</div>

        <HtmlEditorComponent
          content={content}
          onChange={(newValue) => setContent(newValue)}
          handleEditField={handleEditPartners}
        />
      </div>
    </div>
  );
}
