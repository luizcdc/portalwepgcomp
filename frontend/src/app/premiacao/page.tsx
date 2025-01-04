"use client";

import { useState } from "react";

import Premiacoes from "@/components/Premiacao/Premiacoes";
import Banner from "@/components/UI/Banner";

import "./style.scss";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";

export default function Premiacao() {
  const [activeCategory, setActiveCategory] = useState<
    "banca" | "avaliadores" | "publico"
  >("banca");

  const handleChangeCategory = (
    categoria: "banca" | "avaliadores" | "publico"
  ) => {
    setActiveCategory(categoria);
  };

  return (
    <ProtectedLayout>
      <div className="d-flex flex-column before-banner premiacao">
        <div className="d-flex flex-column">
          <Banner title="Premiação" />

          <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column content text-center">
              <div className="d-grid text-black">
                <p className="fw-bold fs-5">
                  As premiações serão dadas por categoria:
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2 fs-6">
                    • Melhores apresentações por voto da audiência
                  </li>
                  <li className="mb-2 fs-6">
                    • Melhores apresentações por voto da banca avaliadora
                  </li>
                  <li className="mb-2 fs-6">• Melhores avaliadores</li>
                </ul>
                <p className="mb-1 fw-bold fs-5">
                  O resultado será divulgado no último dia do evento.
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-4">
            <button
              className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                activeCategory === "banca" ? "click" : "unclick"
              }`}
              onClick={() => handleChangeCategory("banca")}
            >
              Banca
            </button>
            <button
              className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                activeCategory === "avaliadores" ? "click" : "unclick"
              }`}
              onClick={() => handleChangeCategory("avaliadores")}
            >
              Avaliadores
            </button>
            <button
              className={`btn d-flex justify-content-center align-items-center fw-semibold ${
                activeCategory === "publico" ? "click" : "unclick"
              }`}
              onClick={() => handleChangeCategory("publico")}
            >
              Público
            </button>
          </div>

          {activeCategory === "banca" && <Premiacoes categoria="banca" />}
          {activeCategory === "avaliadores" && (
            <Premiacoes categoria="avaliadores" />
          )}
          {activeCategory === "publico" && <Premiacoes categoria="publico" />}
        </div>
      </div>
    </ProtectedLayout>
  );
}
