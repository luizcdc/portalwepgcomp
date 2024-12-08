"use client";
import Contato from "@/components/Contato";
import Endereco from "@/components/Endereco";
import "./style.scss";

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
      <div className="d-flex flex-row justify-content-evenly contato"
        style={{
          gap: "40px",
        }}
      >
        <Contato />
        <Endereco />
      </div>
    </div>
  );
}
