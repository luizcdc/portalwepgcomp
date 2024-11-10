"use client";

export default function OrientacoesAudiencia(){
    return(
        <div id="OrientacoesAudiencia">
            <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "25px",
                gap: "20px",
            }}>
                <div
                style={{
                    border: "solid",
                    borderColor: "#FFA90F",
                    backgroundColor: "white",
                    color: "#FFA90F",
                    width: "190px",
                    height: "30px",
                    borderRadius: "15px",
                    borderWidth: "3px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                }}>Autores</div>

                <div
                style={{
                    border: "solid",
                    borderColor: "#FFA90F",
                    backgroundColor: "white",
                    color: "#FFA90F",
                    width: "190px",
                    height: "30px",
                    borderRadius: "15px",
                    borderWidth: "3px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                }}>Avaliadores</div>

                <div
                style={{
                    border: "solid",
                    borderColor: "#FFA90F",
                    backgroundColor: "#FFA90F",
                    color: "white",
                    width: "190px",
                    height: "30px",
                    borderRadius: "15px",
                    borderWidth: "3px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                }}>Audiência</div>
            </div>

            <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
                color: "black",
                marginLeft: "10px",
                marginBottom: "200px",
            }}>
                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                    <div className="fw-bold fs-6">Recomendações para a audiência</div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div
                        style={{
                            fontSize: "14px",
                        }}>
                            Recomenda-se chegar à sala antes do início de cada sessão.
                        </div>

                    </div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div
                        style={{
                            fontSize: "14px",
                        }}>
                            Após as perguntas dos avaliadores, se houver tempo, o coordenador da sessão 
                            fará a moderação das perguntas da audiência.
                        </div>

                    </div>

                </div>

                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>

                    <div className="fw-bold fs-6">Informações Gerais:</div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div
                        style={{
                            fontSize: "14px",
                        }}>
                            A Programação Preliminar do WEPGCOMP 2025 pode ser encontrada na página do evento.
                        </div>

                    </div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div
                        style={{
                            fontSize: "14px",
                        }}>
                            O evento está organizado em sessões temáticas para apresentação de trabalhos 
                            das/os doutorandas/os matriculadas/os no componente curricular MATA33.
                        </div>

                    </div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div
                        style={{
                            fontSize: "14px",
                        }}>
                            A apresentação no WEPGCOMP é opcional para as/os doutorandas/os que realizaram 
                            ou realizarão o exame de qualificação (MATA34) em 2023. Nesse caso, a nota 
                            do componente MATA33 será a mesma atribuída ao componente MATA34 em 2025.
                        </div>

                    </div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div
                        style={{
                            fontSize: "14px",
                        }}>
                            Cada trabalho apresentado em uma sessão contará com um grupo de, no mínimo, 
                            três docentes responsáveis pela avaliação do trabalho, além de seu orientador.
                        </div>

                    </div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div
                        style={{
                            fontSize: "14px",
                        }}>
                            O evento será realizado na modalidade presencial.
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}