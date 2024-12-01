"use client";

import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";
import { useState } from "react";

import "./style.scss";

export default function OrientacoesAutores() {
  const [content, setContent] = useState("");

  return (
    <div className="orientacoes">
      <HtmlEditorComponent
        content={content}
        onChange={(newValue) => setContent(newValue)}
      />
    </div>
  );
}
