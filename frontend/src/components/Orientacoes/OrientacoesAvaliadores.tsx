"use client";

import "./Orientacoes.css";

export default function OrientacoesAvaliadores(){
    return(
        <div className="orientacoes">
            <div className="text">

                <div className="textSection">
                    
                    <div className="title">Recomendações para os Avaliadores</div>

                    <div className="line">
                        O objetivo principal do WEPGCOMP é tornar públicas as pesquisas de doutorado 
                        e o andamento de suas atividades. Não é necessário ser pesquisador nos temas das 
                        apresentações para avaliar o andamento do trabalho de doutorado.
                    </div>

                </div>

                <div className="textSection">
                    <div className="title">
                        Para as apresentações realizadas na(s) sessão(ões) em que participa como avaliador:
                    </div>

                    <div className="topic">

                        <div className="dot"></div>

                        <div className="line">
                            Observar a data de ingresso do/a discente no PGCOMP e se é bolsista.
                        </div>

                    </div>

                    <div className= "topic">

                        <div className="dot"></div>

                        <div className="line">
                            Fazer perguntas objetivas e comentários construtivos, considerando o 
                            estágio do trabalho: pré-qualificação, qualificação recente 
                            (no ano do evento) e pós-qualificação.
                        </div>

                    </div>

                    <div className= "topic">

                        <div className="dot"></div>

                        <div className="line">
                            Espera-se que o doutorando em estágio de pré-qualificação tenha concluído 
                            as disciplinas e mostre que o tema da pesquisa está definido, com revisão da 
                            literatura em andamento (no mínimo).
                        </div>

                    </div>

                    <div className= "topic">

                        <div className="dot"></div>

                        <div className="line">
                            Se possível, olhar a apresentação do WEPGCOMP do ano anterior para avaliar 
                            o progresso do trabalho de pesquisa do discente.
                        </div>

                    </div>

                    <div className= "topic">

                        <div className="dot"></div>

                        <div className="line">
                            Preencher o formulário de avaliação do trabalho (disponível em link a ser divulgado).
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}