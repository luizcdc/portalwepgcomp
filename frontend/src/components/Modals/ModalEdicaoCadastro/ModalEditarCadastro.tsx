"use client";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { FormCadastroApresentacao } from "@/components/Forms/CadastroApresentacao/FormCadastroApresentacao";

import "./style.scss";

export default function ModalEditarCadastro() {
  return (
    <ModalComponent
      id="editarApresentacaoModal"
      loading={false}
      labelConfirmButton="Alterar"
    >
      <div className=" d-flex justify-content-center mb-5 modal-editar-cadastro">
        <FormCadastroApresentacao />
      </div>
    </ModalComponent>
  );
}
