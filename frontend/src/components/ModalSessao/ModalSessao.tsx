"use client";

import { useState } from "react";
import ModalComponent from "../UI/ModalComponent/ModalComponent";

import "./style.scss";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import FormSessaoGeral from "../Forms/Sessao/FormSessaoGeral";

enum SessaoTipoEnum {
    "Sessão geral do evento" = 1,
    "Sessão de apresentações" = 2
}

// const translateTipoEnum = (op: SessaoTipoEnum) => {
//     const options = {
//         [SessaoTipoEnum["Sessão de apresentações"]]: "Sessão de apresentações",
//         [SessaoTipoEnum["Sessão geral do evento"]]: "Sessão geral do evento",
//     };

//     return options[op];
// }

export default function ModalSessao() {
    const { tipo } = ModalSessaoMock;

  const [tipoSessao, setTipoSessao ]= useState<SessaoTipoEnum>(1);


  return (
    <ModalComponent
      id="sessaoModal"
      loading={false}
      labelConfirmButton="Salvar"
      disabledConfirmButton={false}
      colorButtonConfirm="#FFA90F"
      onConfirm={() => {}}
    >
      <div className="modal-sessao">
        <div className="col-12 mb-1">
          <label className="form-label fw-bold form-title">
            {tipo.label}
          </label>
          <div className="d-flex">
            {
                tipo.options?.map((op, i) => (
                    <div className="form-check me-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      id={`radio${op}-${i}`}
                      value={op}
                      name="radioTipoSessao"
                      onChange={() => setTipoSessao(SessaoTipoEnum[op])}
                    />
                    <label
                      className="form-check-label fw-bold input-title"
                      htmlFor={`radio${op}-${i}`}
                    >
                      {op}
                    </label>
                  </div>
                ))
            }
          </div>
          <p className="text-danger error-message"></p>
        </div>

        {tipoSessao === SessaoTipoEnum["Sessão geral do evento"] && <FormSessaoGeral />}
      </div>
    </ModalComponent>
  );
}
