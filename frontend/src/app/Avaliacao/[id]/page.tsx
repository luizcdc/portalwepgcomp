"use client";

import { usePathname } from "next/navigation"; // Usando usePathname para capturar o caminho
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

import Rating from "@/components/Rating/Rating";
import Banner from "@/components/UI/Banner";
import { MockupDayOne, MockupDayThree, MockupDayTwo } from "@/mocks/Schedule";

import "./style.scss";
import { useEvaluation } from "@/hooks/useEvaluation";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useEdicao } from "@/hooks/useEdicao";

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
  // TODO: Integrar com os modelos de apresentação
  const [presentation, setPresentation] = useState<any | null>(null);
  const [saveEvaluation, setSaveEvaluation] = useState<Evaluation[]>([]);
  const { createEvaluation, getEvaluation, getEvaluationByUser, getEvaluationCriteria } = useEvaluation();
  const { user } = useContext(AuthContext);
  const {Edicao} = useEdicao();

  const sendEvaluation = () => {
    const body: EvaluationParams[] =
      saveEvaluation?.map((criteria) => {
        const { evaluationCriteriaId, submissionId, score, userId, comments } = criteria;
        return { evaluationCriteriaId, submissionId, score, userId, comments };
      }) ?? [];

    createEvaluation(body);
  };

  useEffect(() => {
    if (pathname) {
      const id = pathname.split("/").pop();
      getEvaluationByUser(user?.id ?? "");
      getEvaluationCriteria(Edicao?.id??"");

      if (id) {
        const foundPresentation = findPresentationById(id);
        console.log(foundPresentation);

        if (foundPresentation) {
          getEvaluationByUser(user?.id ?? "");
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
      className="d-flex flex-column"
      style={{
        gap: "10px",
      }}
    >
      <Banner title="Avaliação" />

      <div className="avalieApresentacao">
        <div className="avalieElementos">
          <div className="avalieIdentificador">
            <div className="avalieApresentador">{presentation?.doutorando}</div>
            <div className="avaliePesquisa">{presentation?.titulo}</div>
          </div>
        </div>

        <div className="avaliePerguntas">
          {saveEvaluation?.map((criteria, devIndex) => (
            <div key={criteria.evaluationCriteriaId} className="avalieQuestion">
              <div className="avalieTexto">
                `${devIndex + 1}. ${criteria.name}`
              </div>
              <Rating
                value={criteria.score}
                onChange={(value) =>
                  setSaveEvaluation([
                    ...saveEvaluation,
                    { ...criteria, score: value },
                  ])
                }
              />
            </div>
          ))}
          {!saveEvaluation.length && (
            <div className="d-flex align-items-center justify-content-center p-3 mt-4 me-5">
              <h4 className="empty-list mb-0">
                <Image
                  src="/assets/images/empty_box.svg"
                  alt="Lista vazia"
                  width={90}
                  height={90}
                />
                Essa lista ainda está vazia
              </h4>
            </div>
          )}
        </div>

        <button className="avalieButton" onClick={sendEvaluation}>
          Enviar
        </button>
      </div>
    </div>
  );
}
