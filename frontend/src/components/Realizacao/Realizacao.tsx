"use client";

import Image from "next/image";

import { useEdicao } from "@/hooks/useEdicao";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useEffect, useState } from "react";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

import "./style.scss";

export default function Realizacao() {
  const [content, setContent] = useState("");
  const { updateEdicao, Edicao } = useEdicao();

  const handleEditPartners = () => {
    const eventEditionId = getEventEditionIdStorage();

    if (Edicao) {
      updateEdicao(eventEditionId ?? "", {
        partnersText: content,
        name: Edicao.name
      });
    }
  };

  useEffect(() => {
    setContent(Edicao?.partnersText ?? "");
  }, [Edicao?.partnersText]);

  return (
    <div className="realizacao">
      <div className="realizacao-lista">
        <div className="realizacao-titulo">Realização:</div>

        <div className="realizacao-parceiros">
          <Image
            src={"/assets/images/ic_logo_padrao.png"}
            alt="Computação Logo"
            width={150}
            height={150}
            style={{objectFit: "contain"}}
            priority
          />
          <Image
            src={"/assets/images/brasao_ufba.jpg"}
            alt="UFBA Logo"
            width={150}
            height={150}
            style={{objectFit: "contain"}}
            priority
          />
        </div>
      </div>

      <div className="realizacao-apoio-lista">
        <div className="realizacao-apoio-titulo">Apoio:</div>

        <HtmlEditorComponent
          content={content}
          onChange={(newValue) => setContent(newValue)}
          handleEditField={handleEditPartners}
        />
      </div>
    </div>
  );
}
