"use client";
import backgroundGruposPesquisa from "@/assets/images/background_gruposPesquisa.svg";
import Image from "next/image";

export default function SearchGroups() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "55vh",
      }}
    >
      <div
        className="text-center fs-1"
        style={{
          color: "#054B75",
          fontWeight: 700,
          marginBottom: "2rem"
        }}
      >
        Grupos de Pesquisa
      </div>

      <Image
        src={backgroundGruposPesquisa.src}
        alt="ícone pessoa"
        width={1217.21}
        height={695.88}
        priority={true}
      />
    </div>
  );
}
