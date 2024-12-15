"use client";

import { useState } from "react";

import Star from "@/components/UI/Star";

export default function PresentationModal({
  props,
}: {
  props: PresentationData;
}) {
  const [favorite, setFavorite] = useState<boolean>(false);

  function handleFavorite() {
    setFavorite(!favorite);
  }

  const handleEvaluateClick = () => {
    window.location.href = `/Avaliacao/${props.id}`;
  };

  return (
    <div
      className="d-flex align-items-start flex-column text-black"
      style={{ padding: "0 25px 25px 25px", gap: "10px" }}
    >
      <div
        className="d-flex align-items-center w-100"
        style={{
          gap: "15px",
          borderBottom: "1px solid #000000",
          paddingBottom: "15px",
        }}
      >
        <h3
          className="fw-semibold text-start"
          style={{ fontSize: "18px", lineHeight: "27px" }}
        >
          {props.titulo}
        </h3>
      </div>
      <div className="d-flex justify-content-between w-100">
        <div
          className="d-flex flex-column align-items-start fw-normal text-start"
          style={{ fontSize: "15px", gap: "6px" }}
        >
          <div
            className="d-flex flex-row align-items-start"
            style={{ gap: "10px" }}
          >
            <strong>{props.doutorando}</strong>
            <div> | </div>
            <div>{props.emailDoutorando}</div>
          </div>
          <h4 className="fw-normal text-start" style={{ fontSize: "15px" }}>
            Orientador(a): {props.orientador}
          </h4>
        </div>
        <div>
          <button
            className="fw-semibold bg-white"
            onClick={handleEvaluateClick}
            style={{
              border: "2px solid #FFA90F",
              borderRadius: "20px",
              color: "#FFA90F",
              padding: "3px 20px",
            }}
          >
            Avaliar
          </button>
        </div>
      </div>
      <div className="d-flex" style={{ gap: "10px" }}>
        <em
          className="m-0 text-white"
          style={{
            backgroundColor: "#F17F0C",
            borderRadius: "5px",
            padding: "4px 10px",
            fontSize: "15px",
          }}
        >
          {props.date} - {props.local} - {props.time}
        </em>
        <div onClick={handleFavorite} style={{ cursor: "pointer" }}>
          <Star color={favorite ? "#F17F0C" : "#D9D9D9"} />
        </div>
      </div>
      <div className="d-flex justify-content-left w-100">
        <button
          className="fw-semibold bg-white"
          style={{
            border: "2px solid #FFA90F",
            borderRadius: "20px",
            color: "#FFA90F",
            padding: "3px 20px",
            width: "302px",
          }}
        >
          Baixar apresentação
        </button>
      </div>
      <div style={{ textAlign: "justify" }}>
        <strong>Abstract: </strong>
        {props.descricao}
      </div>
    </div>
  );
}
