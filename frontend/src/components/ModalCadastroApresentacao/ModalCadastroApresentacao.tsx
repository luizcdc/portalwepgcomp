"use client";

import ModalComponent from "../UI/ModalComponent/ModalComponent";

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
        <h1 className="d-flex justify-content-center mt-5 fw-normal title-cadastro-apresentacao">
          ATENÇÃO
        </h1>

        <hr className="linha" />

        <div className="content-cadastro-apresentacao">
          <p>
          A Comissão Organizadora do WEPGComp informa que poderá, a qualquer momento, 
          alterar o dia e o horário das apresentações, visando otimizar a organização da programação do evento. 
          Nos dias de realização do evento, caso haja necessidade, as apresentações também poderão ser antecipadas. 
          Nesses casos, o apresentador será previamente comunicado via telefone para garantir sua ciência e adequada preparação para a nova programação.
          </p>
        </div>
      </div>
    </ModalComponent>
  );
}
