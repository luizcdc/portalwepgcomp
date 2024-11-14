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
                <h1 className="d-flex justify-content-center mt-5 fw-normal title-alterar-senha">
                    WEPGCOMP
                    <span className="ms-2">2025</span>
                </h1>
                <hr />

                <div>
                    <div>
                        <label>Tema</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label>Abstract</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label>Área de atuação</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label>Horário sugerido para a apresentação</label>
                        <input type="calendar" />
                    </div>
                    <div>
                        <label>Slide da apresentação</label>
                        <input type="upload" />
                    </div>
                    <div>
                        <label>Orientador</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label>Insira uma foto sua</label>
                        <input type="upload" />
                    </div>

                    <div>
                        <button type="button">Editar</button>
                    </div>
                    
                </div>

            </div>



        </ModalComponent>
    );
}