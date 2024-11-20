"use client";

import { useState } from "react";
import ModalComponent from "../UI/ModalComponent/ModalComponent";

import "./style.scss";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import FormSessaoGeral from "../Forms/Sessao/FormSessaoGeral";
import FormSessaoApresentacoes from "../Forms/Sessao/FormSessaoApresentacoes";

enum SessaoTipoEnum {
  "Sessão geral do evento" = 1,
  "Sessão de apresentações" = 2,
}

export default function ModalSessao() {
  const { tipo } = ModalSessaoMock;

  const [tipoSessao, setTipoSessao] = useState<SessaoTipoEnum>(1);

  return (
    <ModalComponent id="sessaoModal" loading={false}>
      <div className="modal-sessao px-5">
        <div className="col-12 mb-1">
          <label className="form-label fw-bold form-title">{tipo.label}</label>
          <div className="d-flex">
            {tipo.options?.map((op, i) => (
              <div className="form-check me-3" key={`radio${op}-${i}`}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={`sessao-tipo-radio-${i}`}
                  value={op}
                  name="radioTipoSessao"
                  defaultChecked={!i}
                  onChange={() => setTipoSessao(SessaoTipoEnum[op])}
                />
                <label
                  className="form-check-label fw-bold input-title"
                  htmlFor={`radio${op}-${i}`}
                >
                  {op}
                </label>
              </div>
            ))}
          </div>
          <p className="text-danger error-message"></p>
        </div>

        {tipoSessao === SessaoTipoEnum["Sessão geral do evento"] && (
          <FormSessaoGeral />
        )}

        {tipoSessao === SessaoTipoEnum["Sessão de apresentações"] && (
          <FormSessaoApresentacoes />
        )}
      </div>
    </ModalComponent>
  );
}
