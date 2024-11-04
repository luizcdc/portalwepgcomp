"use client";
import Contato from "@/components/Contato";
import Endereco from "@/components/Endereco";

export default function LocalEvento() {
  return (
    <div
      id='Contato'
      style={{
        backgroundColor: "#0074BA",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexDirection: "row",
          gap: "40px",
          paddingRight: "10rem",
        }}
      >
        <Contato />
        <Endereco />
      </div>
    </div>
  );
}
