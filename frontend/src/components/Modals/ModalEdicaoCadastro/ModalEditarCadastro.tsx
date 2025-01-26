"use client";

import { FormCadastroApresentacao } from "@/components/Forms/CadastroApresentacao/FormCadastroApresentacao";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";

import "./style.scss";

interface ModalEditarCadastro {
  formEdited?: any;
  onClose?: () => void;
}

export default function ModalEditarCadastro({
  formEdited,
  onClose,
}: Readonly<ModalEditarCadastro>) {
  return (
    <ModalComponent
      id="editarApresentacaoModal"
      idCloseModal="editarApresentacaoModalClose"
      loading={false}
      labelConfirmButton="Alterar"
      onClose={onClose}
    >
      <div className=" d-flex justify-content-center mb-5 modal-editar-cadastro">
        <FormCadastroApresentacao formEdited={formEdited} />
      </div>
    </ModalComponent>
  );
}
