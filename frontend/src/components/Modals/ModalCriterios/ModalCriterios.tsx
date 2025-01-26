"use client";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import FormCriterios from "@/components/Forms/Criterios/FormCriterios";

import "./style.scss";

export default function ModalCriterios() {
  return (
    <ModalComponent
      id="criteriosModal"
      idCloseModal="criteriosModalClose"
      loading={false}
      labelConfirmButton="Salvar"
    >
      <div className="body-modal-criterios">
        <h1 className="d-flex justify-content-center fw-bold ms-2">
          Critérios de avaliação de apresentações
        </h1>
        <div className=" d-flex justify-content-center mb-5">
          <FormCriterios />
        </div>
      </div>
    </ModalComponent>
  );
}
