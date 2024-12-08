"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import "./style.scss";

export default function Orientacao() {
  const [content, setContent] = useState("");
  const { signed } = useContext(AuthContext);

  return (
    <div
      id="Orientacao"
    >
      <div className="text-white text-center display-4 fs-1 fw-bold orientacao-titulo">Orientações</div>

      {signed ? (
        <HtmlEditorComponent
          content={content}
          onChange={(newValue) => setContent(newValue)}
        />
      ) : (
        <div className="orientacao-conteudo">
          <div>
            Este evento é uma excelente oportunidade para estudantes
            apresentarem e discutirem suas pesquisas, além de receberem feedback
            valioso de colegas e professores. Clique em "Ver todas as
            orientações" para ter mais informações sobre o evento.
          </div>

          <div className="orientacao-detalhe">
            <div className="fw-bold">Datas Importantes:</div>

            <div className="d-flex flex-direction-row align-items-center gap-2">
              <div
                className="orientacao-ponto-lista"
              ></div>
              <div>Data limite para submissão: 27 de outubro de 2025.</div>
            </div>

            <div className="d-flex flex-direction-row align-items-center gap-2">
              <div
                className="orientacao-ponto-lista"
              ></div>
              <div>O evento será realizado de 12 a 14 de novembro de 2025.</div>
            </div>
          </div>
        </div>
      )}

      <Link
        className="orientacao-link"
        href="/Orientacoes"
      >
        Ver todas as orientações
      </Link>
    </div>
  );
}
