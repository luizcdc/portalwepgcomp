"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import HtmlEditorComponent from "./HtmlEditorComponent/HtmlEditorComponent";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useOrientacao } from "@/hooks/useOrientacao";
import { SessoesMock } from "@/mocks/Sessoes";

export default function Orientacao() {
  const [content, setContent] = useState("");

  const { eventEditionId } = SessoesMock;
  const { signed } = useContext(AuthContext);

  const { postOrientacao } = useOrientacao();

  const handleEditOrientacao = () => {
    postOrientacao({ eventEditionId, summary: content });
  };

  return (
    <div
      id="Orientacao"
      style={{
        backgroundImage: `url(/assets/images/background_orientacao.svg)`,
        backgroundSize: "cover",
        width: "100%",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "20px",
        marginLeft: "8px",
        color: "white",
      }}
    >
      <div className="text-white text-center fs-1 fw-bold">Orientações</div>

      {signed ? (
        <HtmlEditorComponent
          content={content}
          onChange={(newValue) => setContent(newValue)}
          onSave={handleEditOrientacao}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "25px",
            textAlign: "justify",
            fontSize: "18px",
            maxWidth: "695px",
          }}
        >
          <div>
            Este evento é uma excelente oportunidade para estudantes
            apresentarem e discutirem suas pesquisas, além de receberem feedback
            valioso de colegas e professores. Clique em "Ver todas as
            orientações" para ter mais informações sobre o evento.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="fw-bold">Datas Importantes:</div>

            <div className="d-flex flex-direction-row align-items-center gap-2">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              ></div>
              <div>Data limite para submissão: 27 de outubro de 2025.</div>
            </div>

            <div className="d-flex flex-direction-row align-items-center gap-2">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              ></div>
              <div>O evento será realizado de 12 a 14 de novembro de 2025.</div>
            </div>
          </div>
        </div>
      )}

      <Link
        style={{
          border: "solid",
          borderColor: "white",
          width: "300px",
          height: "60px",
          borderRadius: "12px",
          borderWidth: "1px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "600",
          marginTop: "40px",
          fontSize: "18px",
          color: "white",
        }}
        href="/Orientacoes"
      >
        Ver todas as orientações
      </Link>
    </div>
  );
}
