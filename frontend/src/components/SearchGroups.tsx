"use client";
import backgroundGruposPesquisa from "@/assets/images/background_gruposPesquisa.svg";

export default function SearchGroups() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className='text-center fs-1'
        style={{
          color: "#054B75",
          fontWeight: 700,
        }}
      >
        Grupos de Pesquisa
      </div>

      <div
        style={{
          backgroundImage: `url(${backgroundGruposPesquisa.src})`,
          backgroundSize: "cover",
          width: "80%",
          height: "440px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "50px",
        }}
      ></div>
    </div>
  );
}
