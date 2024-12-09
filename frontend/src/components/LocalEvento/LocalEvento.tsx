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
        padding: "20px",
      }}
    >
      <div className="d-flex flex-row justify-content-evenly contato"
        style={{
          gap: "30px",
        }}
      >
        <Contato />
        <Endereco />
      </div>
    </div>
  );
}
