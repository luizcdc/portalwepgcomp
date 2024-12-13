"use client";

import { usePathname } from "next/navigation"; // Usando usePathname para capturar o caminho
import { useContext, useEffect, useState } from "react";

import Rating from "@/components/Rating/Rating";
import Banner from "@/components/UI/Banner";
import { MockupDayOne, MockupDayThree, MockupDayTwo } from "@/mocks/Schedule";

import "./style.scss";
import { useEvaluation } from "@/hooks/useEvaluation";
import { AuthContext } from "@/context/AuthProvider/authProvider";

const allPresentations = [
  ...MockupDayOne.flat(),
  ...MockupDayTwo.flat(),
  ...MockupDayThree.flat(),
];

const findPresentationById = (id: string) => {
  return allPresentations.find((presentation) => presentation.id === id);
};

export default function Avaliacao({ params }) {
  const pathname = usePathname();
  const [presentation, setPresentation] = useState<PresentationData | null>(
    null
  );
  const [saveEvaluation, setSaveEvaluation] = useState<{ score1: number, score2: number, score3: number, score4: number, score5: number }>({ score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 });
  const {createEvaluation, getEvaluation} = useEvaluation();
  const { user } = useContext(AuthContext);

  const sendEvaluation = () => {
    const body = [
      {
        userId: user?.id ?? "",
        submissionId: params?.id ?? "",
        evaluationCriteriaId: "",
        score: saveEvaluation.score1,
      },
      {
        userId: user?.id ?? "",
        submissionId: params?.id ?? "",
        evaluationCriteriaId: "",
        score: saveEvaluation.score2,
      },
      {
        userId: user?.id ?? "",
        submissionId: params?.id ?? "",
        evaluationCriteriaId: "",
        score: saveEvaluation.score3,
      },
      {
        userId: user?.id ?? "",
        submissionId: params?.id ?? "",
        evaluationCriteriaId: "",
        score: saveEvaluation.score4,
      },
      {
        userId: user?.id ?? "",
        submissionId: params?.id ?? "",
        evaluationCriteriaId: "",
        score: saveEvaluation.score5,
      },
    ];

    createEvaluation(body);
  };

  useEffect(() => {
    if (pathname) {
      const id = pathname.split("/").pop();
      getEvaluation(user?.id ?? "");

      if (id) {
        const foundPresentation = findPresentationById(id);
        console.log(foundPresentation);

        if (foundPresentation) {
          getEvaluation(user?.id ?? "");
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
            <Rating value={saveEvaluation.score1} onChange={(value) => setSaveEvaluation({...saveEvaluation,  score1: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              2. Quão satisfeito(a) você ficou com a qualidade e clareza da
              apresentação?
            </div>
            <Rating value={saveEvaluation.score2} onChange={(value) => setSaveEvaluation({...saveEvaluation,  score2: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              3. Quão bem a pesquisa abordou e explicou o problema central?
            </div>
            <Rating value={saveEvaluation.score3} onChange={(value) => setSaveEvaluation({...saveEvaluation,  score3: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              4. Quão clara e prática você considera a solução proposta pela
              pesquisa?
            </div>
            <Rating value={saveEvaluation.score4} onChange={(value) => setSaveEvaluation({...saveEvaluation,  score4: value})}/>
          </div>

          <div className='avalieQuestion'>
            <div className='avalieTexto'>
              5. Como você avalia a qualidade e aplicabilidade dos resultados
              apresentados?
            </div>
            <Rating value={saveEvaluation.score5} onChange={(value) => setSaveEvaluation({...saveEvaluation,  score5: value})}/>
          </div>
        </div>

        <button className='avalieButton' onClick={() => {console.log(saveEvaluation)}}>Enviar</button>
      </div>
    </div>
  );
}
