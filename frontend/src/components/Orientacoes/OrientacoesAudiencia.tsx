"use client";

import "./Orientacoes.css";

export default function OrientacoesAudiencia(){
    return(
        <div className="orientacoes">
            <div className="button">
                <div className="buttonFalse">Autores</div>

                <div className="buttonFalse">Avaliadores</div>

                <div className="buttonTrue">Audiência</div>
            </div>

            <div className="text">

                <div className="textSection">

                    <div className="title">Recomendações para a audiência</div>

                    <div className= "topic">

                        <div className="dot"></div>

                        <div className="line">
                            Recomenda-se chegar à sala antes do início de cada sessão.
                        </div>

                    </div>

                    <div className= "topic">
                        <div className="dot"></div>

                        <div className="line">
                            Após as perguntas dos avaliadores, se houver tempo, o coordenador da sessão 
                            fará a moderação das perguntas da audiência.
                        </div>

                    </div>

                </div>

                <div className="textSection">

                    <div className="title">Informações Gerais:</div>

                    <div className= "topic">
                        <div className="dot"></div>

                        <div className="line">
                            A Programação Preliminar do WEPGCOMP 2025 pode ser encontrada na página do evento.
                        </div>

                    </div>

                    <div className= "topic">
                        <div className="dot"></div>

                        <div className="line">
                            O evento está organizado em sessões temáticas para apresentação de trabalhos 
                            das/os doutorandas/os matriculadas/os no componente curricular MATA33.
                        </div>

                    </div>

                    <div className= "topic">
                        <div className="dot"></div>

                        <div className="line">
                            A apresentação no WEPGCOMP é opcional para as/os doutorandas/os que realizaram 
                            ou realizarão o exame de qualificação (MATA34) em 2023. Nesse caso, a nota 
                            do componente MATA33 será a mesma atribuída ao componente MATA34 em 2025.
                        </div>

                    </div>

                    <div className= "topic">
                        <div className="dot"></div>

                        <div className="line">
                            Cada trabalho apresentado em uma sessão contará com um grupo de, no mínimo, 
                            três docentes responsáveis pela avaliação do trabalho, além de seu orientador.
                        </div>

                    </div>

                    <div className= "topic">
                        <div className="dot"></div>

                        <div className="line">
                            O evento será realizado na modalidade presencial.
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}