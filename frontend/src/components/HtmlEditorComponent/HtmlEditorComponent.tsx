"use client";
import React, { useState } from "react";
import HtmlEditor from "../HtmlEditor/HtmlEditor";

import "./style.scss";

interface HtmlEditorComponentProps {
  content: string;
  onChange: (value: string) => void;
}

export default function HtmlEditorComponent({
  content,
  onChange,
}: Readonly<HtmlEditorComponentProps>) {
  const isAdm = true;
  const [preview, setPreview] = useState<boolean>(false);

  return (
    <div className="previewHtmlEditor">
      {!isAdm || preview ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <HtmlEditor value={content} onChange={onChange} />
      )}

      <button
        className="buttonPreviewHtmlEditor"
        onClick={() => setPreview(!preview)}
      >
        {preview ? "Editar" : "Ver prévia"}
      </button>
    </div>
  );
}
