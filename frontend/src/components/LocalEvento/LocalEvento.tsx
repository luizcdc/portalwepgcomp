"use client";
import Contato from "@/components/Contato";
import Endereco from "@/components/Endereco/Endereco";
import "./style.scss";

export default function LocalEvento() {
  return (
    <div
      id="Contato"
      style={{
        backgroundColor: "#0074BA",
      }}
    >
      <div
        className="d-flex flex-row justify-content-evenly contato"
        style={{
          gap: "30px",
          margin: "  auto",
          width: "92%",
          padding: "30px 0",
        }}
      >
        <Contato />
        <Endereco />
      </div>
    </div>
  );
}
