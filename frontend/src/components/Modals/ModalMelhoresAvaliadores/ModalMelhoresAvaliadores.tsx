"use client";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { FormMelhorAvaliador } from "@/components/Forms/MelhoresAvaliadores/FormMelhoresAvaliadores";

interface ModalMelhoresAvaliadoresProps {
  handleClose: () => void;
}

export default function ModalMelhoresAvaliadores({
  handleClose,
}: ModalMelhoresAvaliadoresProps) {
  const handleSave = () => {
    console.log("Salvar os melhores avaliadores");
    handleClose();
  };
  return (
    <ModalComponent
      onClose={handleClose}
      onConfirm={handleSave}
      isShortModal={true}
      id='escolherAvaliadorModal'
      loading={false}
      labelConfirmButton='Salvar'
      colorButtonConfirm='success'
    >
      <div className='body-modal'>
        <h1 className='d-flex justify-content-center mt-5 fw-bold ms-2'>
          Escolha os Melhores Avaliadores
        </h1>
        <div className=' d-flex justify-content-center mb-5'>
          <FormMelhorAvaliador />
        </div>
      </div>
    </ModalComponent>
  );
}
