"use client";

import { useEffect, useState } from "react";
import "./style.scss";
import { ModalSessaoMock } from "@/mocks/ModalSessoes";
import { SessaoTipoEnum } from "@/enums/session";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import FormSessaoApresentacoes from "@/components/Forms/Sessao/FormSessaoApresentacoes";
import FormSessaoGeral from "@/components/Forms/Sessao/FormSessaoGeral";
import { useSession } from "@/hooks/useSession";

const renderFormContent = (tipo: SessaoTipoEnum) => {
  return tipo === SessaoTipoEnum["Sessão geral do evento"] ? (
    <FormSessaoGeral />
  ) : (
    <FormSessaoApresentacoes />
  );
};

export default function ModalSessao() {
  const { tipo } = ModalSessaoMock;
  const { sessao, setSessao } = useSession();

  const [tipoSessao, setTipoSessao] = useState<SessaoTipoEnum>(
    sessao?.type === SessaoTipoEnum["Sessão geral do evento"]
      ? SessaoTipoEnum["Sessão geral do evento"]
      : SessaoTipoEnum["Sessão de apresentações"]
  );

  useEffect(() => {
    return setSessao(null);
  }, []);

  return (
    <ModalComponent
      id="sessaoModal"
      loading={false}
      onClose={() => {
        setSessao(null);
        setTipoSessao(SessaoTipoEnum["Sessão geral do evento"]);
      }}
    >
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
                  checked={sessao?.id ? sessao.type === op.value : undefined}
                  defaultChecked={
                    op.value === SessaoTipoEnum["Sessão geral do evento"]
                  }
                  disabled={!!sessao?.id}
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

        {renderFormContent(tipoSessao)}
      </div>
    </ModalComponent>
  );
}
