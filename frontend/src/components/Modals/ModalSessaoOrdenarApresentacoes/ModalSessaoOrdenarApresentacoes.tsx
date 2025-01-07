"use client";

import FormSessaoOrdenarApresentacoes from "@/components/Forms/SessaoOrdenarApresentacoes/FormSessaoOrdenarApresentacoes";
import "./style.scss";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { useSession } from "@/hooks/useSession";

export default function ModalSessaoOrdenarApresentacoes() {
  const { sessao } = useSession();

  return (
    <ModalComponent
      id={"trocarOrdemApresentacao"}
      loading={false}
      labelConfirmButton="Confirmar"
      idCloseModal="trocarOrdemApresentacaoClose"
    >
      <div className="m-4 mt-0">
        <h3 className="mb-4 fw-bold">Mudar ordenação das apresentações</h3>

        <div className="mt-4 mb-4">
          <p className="form-label fw-bold form-title">Ordem atual</p>
          {sessao?.presentations
            ?.toSorted((a, b) => a.positionWithinBlock - b.positionWithinBlock)
            ?.map((presentation) => (
              <p key={presentation.id}>{`${
                presentation?.positionWithinBlock + 1
              } - ${presentation?.submission?.title}`}</p>
            ))}
        </div>
        <FormSessaoOrdenarApresentacoes />
      </div>
    </ModalComponent>
  );
}
