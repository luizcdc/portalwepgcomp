"use client";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { FormEdicao } from "@/components/Forms/CadastroEdicao/FormEdicao";
import "./style.scss";

interface ModalEditarEdicaoProps {
  edicaoData: Edicao | null;
}

export default function ModalEditarEdicao({
  edicaoData,
}: Readonly<ModalEditarEdicaoProps>) {
  return (
    <ModalComponent
      id='editarEdicaoModal'
      loading={false}
      labelConfirmButton='Alterar'
    >
      <div className='body-modal'>
        <h1 className='d-flex justify-content-center mt-5 fw-bold ms-2'>
          Editar Evento
        </h1>
        <div className=' d-flex justify-content-center mb-5 modal-editar-edicao'>
          <FormEdicao edicaoData={edicaoData} />
        </div>
      </div>
    </ModalComponent>
  );
}
