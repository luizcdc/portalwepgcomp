"use client";
import React, { useState } from "react";
import HtmlEditor from "../HtmlEditor/HtmlEditor";

import "./style.scss";

interface HtmlEditorComponentProps {
  content: string;
  onChange: (value: string) => void;
  handleEditField?: () => void;
}

export default function HtmlEditorComponent({
  content,
  onChange,
  handleEditField,
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

      <div className="buttonsArea">
        <button
          className="buttonPreviewHtmlEditor"
          onClick={() => setPreview(!preview)}
        >
          {preview ? "Editar" : "Ver prévia"}
        </button>
        {handleEditField && (
          <button className="buttonPreviewHtmlEditor" onClick={handleEditField}>
            Salvar
          </button>
        )}
      </div>
    </div>
  );
}
