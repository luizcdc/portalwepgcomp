"use client";

import Link from "next/link";
import { useState } from "react";
import HtmlEditorComponent from "./HtmlEditorComponent/HtmlEditorComponent";

export default function Orientacao() {
  const [content, setContent] = useState("");

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

      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
      />

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
