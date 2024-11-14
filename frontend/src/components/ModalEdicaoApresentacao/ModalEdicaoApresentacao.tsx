"use client";

import ModalComponent from "../UI/ModalComponent/ModalComponent";

export default function ModalEdicaoApresentacao(){

    const handleSendEdicao = () => {

    }

    return(
        <ModalComponent
            id="alterarApresentacaoModal"
            loading={false}
            labelConfirmButton="Enviar"
            disabledConfirmButton={false}
            colorButtonConfirm="#0065A3"
            onConfirm={handleSendEdicao}
        >
            <div>
            Hola
            </div>



        </ModalComponent>
    );
}