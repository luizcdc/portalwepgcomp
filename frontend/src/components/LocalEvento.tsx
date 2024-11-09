"use client";
import Contato from "@/components/Contato/Contato";
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
      <div className="d-flex flex-row justify-content-evenly"
        style={{
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
