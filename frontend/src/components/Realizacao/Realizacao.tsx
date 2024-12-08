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

        <div
          style={{
            backgroundImage: `url(/assets/images/logo_computacao.svg)`,
            backgroundSize: "cover",
            width: "240px",
            height: "70px",
          }}
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
          <div
            style={{
              backgroundImage: `url(/assets/images/logo_ufba.svg)`,
              backgroundSize: "cover",
              width: "138px",
              height: "89px",
            }}
          ></div>

          <div
            style={{
              backgroundImage: `url(/assets/images/logo_jusbrasil.svg)`,
              backgroundSize: "cover",
              width: "208px",
              height: "32px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
