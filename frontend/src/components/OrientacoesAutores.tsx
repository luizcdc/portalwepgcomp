"use client";

export default function OrientacoesAutores(){
    return(
        <div id="OrientacoesAutores">
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
                fontSize: "14px",
                color: "black",
                marginLeft: "10px",
                marginBottom: "100px",
            }}>

                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                    <div className='fw-bold'>Template para slides</div>
                    <div>
                        O template para slides do WEPGCOMP está disponível aqui. Faça uma cópia, 
                        renomeie para wepgcomp25-nome-sobrenome, e adicione os seus slides.
                    </div>
                    <div>
                        Os dois primeiros slides do template (“Título do trabalho” e “Ficha do trabalho”)
                        e o slide sobre “Estágio atual da pesquisa” são obrigatórios.
                    </div>
                </div>

                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                    <div className="fw-bold">Depósito de slides no Zenodo</div>
                    <div>
                        Os autores devem depositar no Zenodo, até 20/11/2025, 23:59h (BRT), 
                        um arquivo (formato PDF) com a versão final dos slides da apresentação.
                    </div>
                    <div>
                        O nome do arquivo deve ser wepgcomp23-nome-sobrenome.pdf. 
                        Link para upload na comunidade do WEPGCOMP no Zenodo.
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
                            Os organizadores do WEPGCOMP 2025 farão a coleta dos slides depositados no 
                            Zenodo no dia 21/11 e os disponibilizarão para os coordenadores de sessão.
                        </div>
                    </div>
                </div>

                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                    <div className="fw-bold">Apresentação de trabalhos</div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>

                        <div>
                            O WEPGCOMP 2025 será presencial e, em casos excepcionais, apresentações 
                            poderão ser remotas.
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
                            Os slides usados na apresentação são os que estiverem depositados no Zenodo. 
                            Não haverá mudança de computador entre as apresentações.
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
                            Cada apresentação não deve ultrapassar os 10 minutos de duração. 
                            Na sequência da apresentação, os avaliadores terão 5 minutos para perguntas 
                            e sugestões.
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
                            O controle de tempo da apresentação será rigoroso: 10 minutos para 
                            apresentação oral e 5 minutos para perguntas.
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
                            Em caso de problemas técnicos, a apresentação será reagendada para o final 
                            da sessão ou para a sessão seguinte.
                        </div>
                    </div>
                </div>

                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                    <div className="fw-bold">Boas Práticas para o(a) Apresentador(a)</div>

                    <div className='d-flex flex-direction-row align-items-center gap-2'>
                        <div
                        style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "10px",
                            backgroundColor: "black",
                          }}></div>
                          
                        <div>
                            Estar presente e entrar em contato com o/a coordenadora da sua sessão 
                            antes do início da sessão em que fará a sua apresentação.
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
                            No caso de apresentação remota, testar a câmera e o microfone de seu 
                            computador ou smartphone, e sua conexão com a Internet, ao menos 
                            30 minutos antes do início da sua sessão.
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
                            Em caso de problemas, entrar em contato com a coordenação da sessão 
                            (a ser divulgada na página do evento).
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
                            Recomenda-se o uso de headset para diminuir a interferência de sons externos durante a apresentação.
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}