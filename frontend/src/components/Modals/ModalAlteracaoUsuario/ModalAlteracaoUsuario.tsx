"use client";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import "./style.scss";

export default function ModalAlteracaoUsuario() {
  return (
    <ModalComponent
      id="alteracaoModal"
      loading={false}
      disabledConfirmButton={false}
      onConfirm={() => console.log("Confirmado!")}
      labelConfirmButton="Confirmar"
      colorButtonConfirm="#0065A3"
    >
      <div className="modal-alteracao-usuario">
        <h1 className="title-alteracao-usuario">
          ATENÇÃO
        </h1>

        <hr className="linha" />

        <div className="content-alteracao-usuario">
          <p>
          Ao clicar em "Confirmar", você declara estar ciente 
          de que está prestes a alterar as permissões e/ou o status de um usuário no sistema. 
          Essa ação pode impactar diretamente o acesso e as funcionalidades disponíveis para o referido 
          usuário. Recomenda-se verificar cuidadosamente as informações antes de prosseguir, 
          pois a alteração será registrada no sistema e poderá ser auditada posteriormente.
          </p>
        </div>
      </div>
    </ModalComponent>
  );
}