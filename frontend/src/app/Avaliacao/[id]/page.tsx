"use client";

import Image from "next/image";
import { usePathname } from "next/navigation"; // Usando usePathname para capturar o caminho
import { useEffect, useState } from "react";

import Rating from "@/components/Rating/Rating";
import Banner from "@/components/UI/Banner";
import { MockupDayOne, MockupDayThree, MockupDayTwo } from "@/mocks/Schedule";
import { EvaluatePage } from "@/models/avaliacao";

import "./style.scss";

const allPresentations = [
    ...MockupDayOne.flat(),
    ...MockupDayTwo.flat(),
    ...MockupDayThree.flat(),
];

const findPresentationById = (id: string) => {
    return allPresentations.find((presentation) => presentation.id === id);
};

export default function AvaliacaoPage() {
    const pathname = usePathname();
    const [presentation, setPresentation] = useState<EvaluatePage | null>(null);

    useEffect(() => {
        if (pathname) {
            const id = pathname.split("/").pop();

            if (id) {
                const foundPresentation = findPresentationById(id);

                if (foundPresentation) {
                    setPresentation({
                        id,
                        titulo: foundPresentation.title,
                        doutorando: foundPresentation.author || "Não informado",
                    });
                }
            }
        }
    }, [pathname]);

    if (!presentation) {
        return <div>Carregando...</div>;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
        >
            <Banner title="Avaliação" />

            <div className="avalieApresentacao">
                <div className="avalieElementos">
                    <Image
                        src={"/assets/images/person_icon.svg"}
                        alt="ícone pessoa"
                        width={65}
                        height={65}
                        priority={true}
                    />

                    <div className="avalieIdentificador">
                        <div className="avalieApresentador">{presentation.doutorando}</div>
                        <div className="avaliePesquisa">{presentation.titulo}</div>
                    </div>
                </div>

                <div className="avaliePerguntas">
                    <div className="avalieQuestion">
                        <div className="avalieTexto">
                            1. Quão satisfeito(a) você ficou com o conteúdo da pesquisa apresentada?
                        </div>
                        <Rating />
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">
                            2. Quão satisfeito(a) você ficou com a qualidade e clareza da apresentação?
                        </div>
                        <Rating />
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">
                            3. Quão bem a pesquisa abordou e explicou o problema central?
                        </div>
                        <Rating />
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">
                            4. Quão clara e prática você considera a solução proposta pela pesquisa?
                        </div>
                        <Rating />
                    </div>

                    <div className="avalieQuestion">
                        <div className="avalieTexto">
                            5. Como você avalia a qualidade e aplicabilidade dos resultados apresentados?
                        </div>
                        <Rating />
                    </div>
                </div>

                <div className="avalieButton">Enviar</div>
            </div>
        </div>
    );
}
