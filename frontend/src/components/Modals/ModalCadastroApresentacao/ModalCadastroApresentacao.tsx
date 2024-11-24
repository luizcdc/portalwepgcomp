"use client";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import "./style.scss";

export default function ModalCadastroApresentacao() {
  return (
    <ModalComponent
      id="apresentacaoModal"
      loading={false}
      disabledConfirmButton={false}
      onConfirm={() => console.log("Confirmado!")}
      labelConfirmButton="Enviar"
      colorButtonConfirm="#0065A3"
    >
      <div className="modal-cadastro-apresentacao">
        <h1 className="title-cadastro-apresentacao">
          ATENÇÃO
        </h1>

        <hr className="linha" />

        <div className="content-cadastro-apresentacao">
          <p>
          Ao clicar em "Enviar", você declara estar ciente de que a Comissão Organizadora do WEPGCOMP poderá, a qualquer momento, alterar o dia e o horário das apresentações, visando otimizar a organização da programação do evento. 
          Nos dias de realização do evento, caso haja necessidade, as apresentações também poderão ser antecipadas. 
          Nesses casos, o apresentador será previamente comunicado via telefone para garantir sua ciência e adequada preparação para a nova programação.
          </p>
        </div>
      </div>
    </ModalComponent>
  );
}
