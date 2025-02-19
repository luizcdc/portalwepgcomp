"use client";
import React, { useContext, useState } from "react";
import HtmlEditor from "../HtmlEditor/HtmlEditor";

import "./style.scss";

import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useEdicao } from "@/hooks/useEdicao";

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
  const { Edicao } = useEdicao();

  const isAdm = user?.level === "Superadmin";

  return (
    <div className="previewHtmlEditor">
      {!isAdm || preview || !Edicao?.isActive ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <HtmlEditor value={content} onChange={onChange} />
      )}

      {isAdm && (
        <div className="buttonsArea">
          {handleEditField && (
            <button
              className="buttonPreviewHtmlEditor"
              onClick={() => {
                if (!preview) handleEditField();
                setPreview(!preview);
              }}
              disabled={!Edicao?.isActive}
            >
              {preview ? "Editar" : "Salvar"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
