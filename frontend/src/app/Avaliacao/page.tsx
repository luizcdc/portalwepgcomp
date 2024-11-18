"use client"

import Banner from "@/components/UI/Banner";
import "./style.scss";
import Rating from "@/components/Rating/Rating";

export default function Avaliacao(){
    return(
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
        }}>
            <Banner title="Avaliação"/>

            <div className="avalieApresentacao">

                <div className="avalieElementos">

                    <div className="avalieFoto"></div>

                    <div className="avalieIdentificador">

                        <div className="avalieApresentador">Nome do(a) Apresentador(a)</div>

                        <div className="avaliePesquisa">Título da pesquisa</div>
                    </div>
                </div>

                <div className="avaliePerguntas">

                    <div className="avalieQuestion">
                        <div className="avalieTexto">1. Quão satisfeito(a) você ficou com o conteúdo da pesquisa apresentada?</div>
                        <Rating/>
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">2. Quão satisfeito(a) você ficou com a qualidade e clareza da apresentação?</div>
                        <Rating/>
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">3. Quão bem a pesquisa abordou e explicou o problema central?</div>
                        <Rating/>
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">4. Quão clara e prática você considera a solução proposta pela pesquisa?</div>
                        <Rating/>
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">5. Como você avalia a qualidade e aplicabilidade dos resultados apresentados?</div>
                        <Rating/>
                    </div>
                </div>

                <div className="avalieButton">Enviar</div>

            </div>

        </div>
    );
}