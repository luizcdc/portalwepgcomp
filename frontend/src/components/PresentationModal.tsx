"use client";

import PersonIcon from "@/assets/images/person_icon.svg";
import Image from "next/image";

interface presentationData {
  titulo: string;
  doutorando: string;
  emailDoutorando: string;
  orientador: string;
  date: string;
  local: string;
  time: string;
  descricao: string;
}

export default function PresentationModal({
  props,
}: {
  props: presentationData;
}) {
  return (
    <div
      style={{
        padding: "0 25px 25px 25px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "flex-start",
        color: "black",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          borderBottom: "1px solid #000000",
          paddingBottom: "15px",
          width: "100%",
        }}
      >
        <Image
          src={PersonIcon}
          alt='PGCOMP Logo'
          width={110}
          height={110}
          priority={true}
        />
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "27px",
            textAlign: "left",
          }}
        >
          {props.titulo}
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          fontSize: "15px",
          fontWeight: "400",
          textAlign: "left",
          gap: "6px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <strong>{props.doutorando}</strong>

          <div> | </div>
          {props.emailDoutorando}
        </div>
        <h4 style={{ fontSize: "15px", fontWeight: "400", textAlign: "left" }}>
          Orientador(a): Prof. {props.orientador}
        </h4>
      </div>
      <div>
        <em
          style={{
            backgroundColor: "#F17F0C",
            color: "white",
            borderRadius: "5px",
            padding: "4px 10px",
            margin: "0px",
            fontSize: "15px",
          }}
        >
          {props.date} - {props.local} - {props.time}
        </em>
      </div>
      <div
        style={{
          textAlign: "left",
        }}
      >
        <strong>Descrição da pesquisa: </strong>
        {props.descricao}
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <button
          style={{
            border: "2px solid #FFA90F",
            borderRadius: "20px",
            color: "#FFA90F",
            padding: "3px 20px",
            backgroundColor: "white",
            fontWeight: "semibold",
            width: "302px",
          }}
        >
          Acessar Apresentação
        </button>
      </div>
    </div>
  );
}
