"use client";

export default function OrientacoesAvaliadores(){
    return(
        <div id="OrientacoesAvaliadores">
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
                }}>Avaliadores</div>

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
                    <div className="fw-bold fs-6">Recomendações para os Avaliadores</div>

                    <div
                    style={{
                        fontSize: "14px",
                    }}>
                        O objetivo principal do WEPGCOMP é tornar públicas as pesquisas de doutorado 
                        e o andamento de suas atividades. Não é necessário ser pesquisador nos temas das 
                        apresentações para avaliar o andamento do trabalho de doutorado.
                    </div>

                </div>

                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    fontSize: "14px",
                }}>
                    <div className="fw-semibold">
                        Para as apresentações realizadas na(s) sessão(ões) em que participa como avaliador:
                    </div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>
                        <div>
                            Observar a data de ingresso do/a discente no PGCOMP e se é bolsista.
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
                        <div>
                            Fazer perguntas objetivas e comentários construtivos, considerando o 
                            estágio do trabalho: pré-qualificação, qualificação recente 
                            (no ano do evento) e pós-qualificação.
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
                        <div>
                            Espera-se que o doutorando em estágio de pré-qualificação tenha concluído 
                            as disciplinas e mostre que o tema da pesquisa está definido, com revisão da 
                            literatura em andamento (no mínimo).
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
                        <div>
                            Se possível, olhar a apresentação do WEPGCOMP do ano anterior para avaliar 
                            o progresso do trabalho de pesquisa do discente.
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
                        <div>
                            Preencher o formulário de avaliação do trabalho (disponível em link a ser divulgado).
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}