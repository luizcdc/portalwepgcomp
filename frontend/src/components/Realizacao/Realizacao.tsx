"use client";

import Image from "next/image";

import { useEdicao } from "@/hooks/useEdicao";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useEffect, useState } from "react";
import { SessoesMock } from "@/mocks/Sessoes";

import "./style.scss";

export default function Realizacao() {
  const [content, setContent] = useState("");
  const { updateEdicao, Edicao } = useEdicao();
  const { eventEditionId } = SessoesMock;

  const handleEditPartners = () => {
    updateEdicao(eventEditionId, { partnersText: content });
  };

  useEffect(() => {
    setContent(Edicao?.partnersText ?? "");
  }, [Edicao?.partnersText]);

  return (
    <div className="realizacao">
      <div className="realizacao-lista">
        <div className="realizacao-titulo">Realização:</div>

        <div id="realizacao-computacao" className="parceiros">
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

      <div className="realizacao-apoio-lista">
        <div className="realizacao-apoio-titulo">Apoio:</div>

        <HtmlEditorComponent
          content={content}
          onChange={(newValue) => setContent(newValue)}
          handleEditField={handleEditPartners}
        />
      </div>

      {/* <div className="realizacao"
    >
      <div className="realizacao-lista"
      >
        <div className="realizacao-titulo"
        >
          Realização:
        </div>

        <div id="realizacao-computacao"
        ></div>
      </div>

      <div className="realizacao-apio-lista"
      >
        <div className="realizacao-apoio-titulo"
        >
          Apoio:
        </div>

        <div className="realizacao-apoio-lista-itens"
        >
          <div id="realizacao-ufba"
          ></div>

          <div id="realizacao-jusbrasil"
          ></div>
        </div>
      </div>
    </div> */}
    </div>
  );
}
