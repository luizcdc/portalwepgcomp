"use client";

import Link from "next/link";
import "./Orientacoes.css";

export default function OrientacoesAutores(){
    return(
        <div className="orientacoes">
            <div className="text">

                <div className="textSection">

                    <div className="title">Template para slides</div>

                    <div className="line">
                        O template para slides do WEPGCOMP está disponível <Link href=''><span className="link">aqui</span></Link>. Faça uma cópia, 
                        renomeie para wepgcomp25-nome-sobrenome, e adicione os seus slides.
                    </div>

                    <div className="line">
                        Os dois primeiros slides do template (“Título do trabalho” e “Ficha do trabalho”)
                        e o slide sobre “Estágio atual da pesquisa” são obrigatórios.
                    </div>

                </div>

                <div className="textSection">

                    <div className="title">Depósito de slides no Zenodo</div>

                    <div className="line">
                        Os autores devem depositar no Zenodo, até 20/11/2025, 23:59h (BRT), 
                        um arquivo (formato PDF) com a versão final dos slides da apresentação.
                    </div>

                    <div className="line">
                        O nome do arquivo deve ser wepgcomp23-nome-sobrenome.pdf. 
                        <Link href=''><span className="link blue">Link para upload na comunidade do WEPGCOMP no Zenodo</span></Link>.
                    </div>

                    <div className="topic">

                        <div className="dot"></div>

                        <div className="line">
                            Os organizadores do WEPGCOMP 2025 farão a coleta dos slides depositados no 
                            Zenodo no dia 21/11 e os disponibilizarão para os coordenadores de sessão.
                        </div>

                    </div>

                </div>

                <div className="textSection">

                    <div className="title">Apresentação de trabalhos</div>

                    <div className="topic">

                        <div className="dot"></div>

                        <div className="line">
                            O WEPGCOMP 2025 será presencial e, em casos excepcionais, apresentações 
                            poderão ser remotas.
                        </div>

                    </div>

                    <div className="topic">
                        <div className="dot"></div>

                        <div className="line">
                            Os slides usados na apresentação são os que estiverem depositados no Zenodo. 
                            Não haverá mudança de computador entre as apresentações.
                        </div>

                    </div>

                    <div className="topic">

                        <div className="dot"></div>
                          
                        <div className="line">
                            Cada apresentação não deve ultrapassar os 10 minutos de duração. 
                            Na sequência da apresentação, os avaliadores terão 5 minutos para perguntas 
                            e sugestões.
                        </div>

                    </div>

                    <div className="topic">

                        <div className="dot"></div>
                          
                        <div className="line">
                            O controle de tempo da apresentação será rigoroso: 10 minutos para 
                            apresentação oral e 5 minutos para perguntas.
                        </div>

                    </div>

                    <div className="topic">

                        <div className="dot"></div>
                          
                        <div className="line">
                            Em caso de problemas técnicos, a apresentação será reagendada para o final 
                            da sessão ou para a sessão seguinte.
                        </div>

                    </div>

                </div>

                <div className="textSection">

                    <div className="title">Boas Práticas para o(a) Apresentador(a)</div>

                    <div className="topic">

                        <div className="dot"></div>
                          
                        <div className="line">
                            Estar presente e entrar em contato com o/a coordenadora da sua sessão 
                            antes do início da sessão em que fará a sua apresentação.
                        </div>

                    </div>

                    <div className="topic">

                        <div className="dot"></div>
                          
                        <div className="line">
                            No caso de apresentação remota, testar a câmera e o microfone de seu 
                            computador ou smartphone, e sua conexão com a Internet, ao menos 
                            30 minutos antes do início da sua sessão.
                        </div>

                    </div>

                    <div className="topic">

                        <div className="dot"></div>
                          
                        <div className="line">
                            Em caso de problemas, entrar em contato com a coordenação da sessão 
                            (a ser divulgada na página do evento).
                        </div>

                    </div>

                    <div className="topic">

                        <div className="dot"></div>
                          
                        <div className="line">
                            Recomenda-se o uso de headset para diminuir a interferência de sons externos durante a apresentação.
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}