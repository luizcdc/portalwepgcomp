"use client";
import "./style.scss";

export default function Realizacao() {
  return (
  <div className="realizacao"
    >
      <div className="realizacao-lista"
      >
        <div className="realizacao-titulo"
        >
          Realização:
        </div>

        <div id="realizacao-computacao"
        ></div>
      </div>

      <div className="realizacao-apio-lista"
      >
        <div className="realizacao-apoio-titulo"
        >
          Apoio:
        </div>

        <div className="realizacao-apoio-lista-itens"
        >
          <div id="realizacao-ufba"
          ></div>

          <div id="realizacao-jusbrasil"
          ></div>
        </div>
      </div>
    </div>
  );
}
