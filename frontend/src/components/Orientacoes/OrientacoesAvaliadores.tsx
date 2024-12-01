"use client";

import { useState } from "react";
import HtmlEditorComponent from "../HtmlEditorComponent/HtmlEditorComponent";

import "./style.scss";

export default function OrientacoesAvaliadores() {
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
