"use client";
import React, { useContext, useState } from "react";
import HtmlEditor from "../HtmlEditor/HtmlEditor";

import "./style.scss";

import { AuthContext } from "@/context/AuthProvider/authProvider";

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
  const [preview, setPreview] = useState<boolean>(!content);
  const { user } = useContext(AuthContext);

  const isAdm = user?.level === "Superadmin";

  return (
    <div className="previewHtmlEditor">
      {!isAdm || preview ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <HtmlEditor value={content} onChange={onChange} />
      )}

      {isAdm && (
        <div className="buttonsArea">
          <button
            className="buttonPreviewHtmlEditor"
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Editar" : "Ver prévia"}
          </button>
          {handleEditField && (
            <button
              className="buttonPreviewHtmlEditor"
              onClick={handleEditField}
            >
              Salvar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
