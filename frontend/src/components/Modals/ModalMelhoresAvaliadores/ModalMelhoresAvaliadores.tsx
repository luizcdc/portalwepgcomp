"use client";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { FormMelhorAvaliador } from "@/components/Forms/MelhoresAvaliadores/FormMelhoresAvaliadores";
import "./style.scss";

interface ModalMelhoresAvaliadoresProps {
  handleClose: () => void;
}

export default function ModalMelhoresAvaliadores({
  handleClose,
}: ModalMelhoresAvaliadoresProps) {
  const handleSave = () => {
    handleClose();
  };
  return (
    <ModalComponent
      onClose={handleClose}
      onConfirm={() => {
        const form = document.querySelector("form");
        form?.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }}
      id='escolherAvaliadorModal'
      idCloseModal='escolherAvaliadorModalClose'
      loading={false}
      labelConfirmButton='Salvar'
      colorButtonConfirm='success'
    >
      <div className='body-modal'>
        <div className=' d-flex justify-content-center fw-bold ms-5 fs-1'>
          Escolha os melhores avaliadores
        </div>
        <div className=' d-flex justify-content-center fs-6 ms-5'>
          <FormMelhorAvaliador onSubmit={handleSave} />
        </div>
      </div>
    </ModalComponent>
  );
}
