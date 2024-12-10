"use client";

import { usePathname } from "next/navigation"; // Usando usePathname para capturar o caminho
import { useEffect, useState } from "react";

import Rating from "@/components/Rating/Rating";
import Banner from "@/components/UI/Banner";
import { MockupDayOne, MockupDayThree, MockupDayTwo } from "@/mocks/Schedule";

import "./style.scss";
import { useEvaluation } from "@/hooks/useEvaluation";

const allPresentations = [
  ...MockupDayOne.flat(),
  ...MockupDayTwo.flat(),
  ...MockupDayThree.flat(),
];

const findPresentationById = (id: string) => {
  return allPresentations.find((presentation) => presentation.id === id);
};

export default function Avaliacao() {
  const pathname = usePathname();
  const [presentation, setPresentation] = useState<PresentationData | null>(
    null
  );
  const [saveEvaluation, setSaveEvaluation] = useState<{ 1: number, 2: number, 3: number, 4: number, 5: number }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const {createEvaluation, getEvaluation} = useEvaluation();

  const sendEvaluation = () => {
    createEvaluation(saveEvaluation);
  };

  useEffect(() => {
    if (pathname) {
      const id = pathname.split("/").pop();

      if (id) {
        const foundPresentation = findPresentationById(id);

        if (foundPresentation) {
          getEvaluation("");
          setPresentation({
            id,
            titulo: foundPresentation.title,
            doutorando: foundPresentation.author || "Não informado",
          });
        }
      }
    }
  }, [pathname]);

  return (
    <div
      className='d-flex flex-column'
      style={{
        gap: "10px",
      }}
    >
      <Banner title='Avaliação' />

      <div className='avalieApresentacao'>

        <div className='avalieElementos'>
          <div className='avalieIdentificador'>
            <div className='avalieApresentador'>{presentation?.doutorando}</div>
            <div className='avaliePesquisa'>{presentation?.titulo}</div>
          </div>
        </div>

        <div className='avaliePerguntas'>
          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              1. Quão satisfeito(a) você ficou com o conteúdo da pesquisa
              apresentada?
            </div>
            <Rating value={saveEvaluation[1]} onChange={(value) => setSaveEvaluation({...saveEvaluation,  1: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              2. Quão satisfeito(a) você ficou com a qualidade e clareza da
              apresentação?
            </div>
            <Rating value={saveEvaluation[2]} onChange={(value) => setSaveEvaluation({...saveEvaluation,  2: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              3. Quão bem a pesquisa abordou e explicou o problema central?
            </div>
            <Rating value={saveEvaluation[3]} onChange={(value) => setSaveEvaluation({...saveEvaluation,  3: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              4. Quão clara e prática você considera a solução proposta pela
              pesquisa?
            </div>
            <Rating value={saveEvaluation[4]} onChange={(value) => setSaveEvaluation({...saveEvaluation,  4: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              5. Como você avalia a qualidade e aplicabilidade dos resultados
              apresentados?
            </div>
            <Rating value={saveEvaluation[5]} onChange={(value) => setSaveEvaluation({...saveEvaluation,  5: value})}/>
          </div>
        </div>

        <button className='avalieButton' onClick={() => {console.log(saveEvaluation)}}>Enviar</button>
      </div>
    </div>
  );
}
