"use client";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { FormCadastroApresentacao } from "@/components/Forms/CadastroApresentacao/FormCadastroApresentacao";

import "./style.scss";
interface ModalEditarCadastro {
  formEdited?: any;
}
export default function ModalEditarCadastro({
  formEdited
}: Readonly<ModalEditarCadastro>) {
  return (
    <ModalComponent
      id="editarApresentacaoModal"
      loading={false}
      labelConfirmButton="Alterar"
    >
      <div className=" d-flex justify-content-center mb-5 modal-editar-cadastro">
        <FormCadastroApresentacao formEdited={formEdited} />
      </div>
    </ModalComponent>
  );
}
