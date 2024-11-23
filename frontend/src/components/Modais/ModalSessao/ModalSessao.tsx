"use client";

import { useState } from "react";

import "./style.scss";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";

import { SessaoTipoEnum } from "@/enums/session";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import FormSessaoApresentacoes from "@/components/Forms/Sessao/FormSessaoApresentacoes";
import FormSessaoGeral from "@/components/Forms/Sessao/FormSessaoGeral";

export default function ModalSessao() {
  const { tipo } = ModalSessaoMock;

  const [tipoSessao, setTipoSessao] = useState<SessaoTipoEnum>(
    SessaoTipoEnum["Sessão geral do evento"]
  );

  return (
    <ModalComponent id="sessaoModal" loading={false}>
      <div className="modal-sessao px-5">
        <div className="col-12 mb-1">
          <label className="form-label fw-bold form-title tipo-sessao">
            {tipo.label}
          </label>
          <div className="d-flex">
            {tipo.options?.map((op, i) => (
              <div className="form-check me-3" key={`radio${op.value}-${i}`}>
                <input
                  type="radio"
                  className="form-check-input"
                  id={`sessao-tipo-radio-${i}`}
                  value={op.value}
                  name="radioTipoSessao"
                  defaultChecked={!i}
                  onChange={() => setTipoSessao(op.value as SessaoTipoEnum)}
                />
                <label
                  className="form-check-label fw-bold input-title"
                  htmlFor={`radio${op}-${i}`}
                >
                  {op.label}
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
