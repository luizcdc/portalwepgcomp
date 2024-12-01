"use client";

import dynamic from "next/dynamic";
import "jodit/es5/jodit.min.css";

import React from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const HtmlEditor = ({ value, onChange }) => {
  const config = {
    readonly: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    style: {
      color: "black",
    },
  };

  return (
    <JoditEditor
      value={value}
      config={config}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
};

export default HtmlEditor;
