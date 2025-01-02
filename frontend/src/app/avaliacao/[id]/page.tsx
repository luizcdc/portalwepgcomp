"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";

import Rating from "@/components/Rating/Rating";
import Banner from "@/components/UI/Banner";

import "./style.scss";
import { useEvaluation } from "@/hooks/useEvaluation";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { usePresentation } from "@/hooks/usePresentation";
import LoadingPage from "@/components/LoadingPage";

export default function Avaliacao({ params }) {
  const [saveEvaluation, setSaveEvaluation] = useState<
    { evaluation: Evaluation | null; criteria: EvaluationCriteria | null }[]
  >([]);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const {
    makeEvaluation,
    evaluations,
    evaluationCriteria,
    getEvaluationByUser,
    getEvaluationCriteria,
    loadingEvaluation,
  } = useEvaluation();
  const { getPresentationAll, presentationList } = usePresentation();
  const { user } = useContext(AuthContext);

  const sendEvaluation = () => {
    const body: EvaluationParams[] =
      saveEvaluation?.map((criteria) => {
        const { evaluationCriteriaId, submissionId, score, userId, comments } =
          criteria.evaluation as Evaluation;

        return { evaluationCriteriaId, submissionId, score, userId, comments };
      }) ?? [];

    makeEvaluation(body);
  };

  useEffect(() => {
    const eventEditionId = getEventEditionIdStorage();

    getPresentationAll(eventEditionId ?? "");
    getEvaluationCriteria(eventEditionId ?? "");
    getEvaluationByUser(user?.id ?? "");
  }, []);

  useEffect(() => {
    if (params?.id) {
      const foundPresentation = presentationList.find(
        (presentationValue) => presentationValue?.id === params?.id
      );

      if (foundPresentation) {
        const evaluationsFilterBySubmission = evaluations?.filter(
          (value) => value.submissionId === foundPresentation?.submission?.id
        );

        const saveEvaluationValues = evaluationCriteria?.map((criteria) => {
          const evaluationValue = evaluationsFilterBySubmission?.find(
            (v) => v.evaluationCriteriaId === criteria.id
          );

          return {
            evaluation: evaluationValue || null,
            criteria: criteria,
          };
        });

        setPresentation(foundPresentation as unknown as Presentation);
        setSaveEvaluation(saveEvaluationValues);
      }
    }
  }, [presentationList.length, evaluations?.length]);

  return (
    <div
      className="d-flex flex-column"
      style={{
        gap: "10px",
      }}
    >
      <Banner title="Avaliação" />
      {(loadingEvaluation || !presentation?.submission?.title) && (
        <LoadingPage />
      )}
      {!loadingEvaluation && presentation?.submission?.title && (
        <div className="avalieApresentacao">
          <div className="avalieElementos">
            <div className="avalieIdentificador">
              <div className="avalieApresentador">
                {presentation?.submission?.mainAuthor?.name}
              </div>
              <div className="avaliePesquisa">
                {presentation?.submission?.title}
              </div>
            </div>
          </div>

          <div className="avaliePerguntas">
            {saveEvaluation?.map((evaluationData, devIndex) => (
              <div
                key={evaluationData?.criteria?.id}
                className="avalieQuestion"
              >
                <div className="avalieTexto">
                  {`${devIndex + 1}. ${evaluationData?.criteria?.description}`}
                </div>
                <Rating
                  value={evaluationData?.evaluation?.score ?? 0}
                  onChange={(value) => {
                    setSaveEvaluation((oldValues) =>
                      oldValues?.map((item, index) =>
                        index === devIndex
                          ? {
                              ...item,
                              evaluation: {
                                userId: user?.id ?? "",
                                submissionId:
                                  presentation?.submission?.id ?? "",
                                evaluationCriteriaId: item.criteria?.id ?? "",
                                score: value,
                              },
                            }
                          : item
                      )
                    );
                  }}
                />
              </div>
            ))}
            {!saveEvaluation?.length && (
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

          <button
            className="avalieButton"
            onClick={sendEvaluation}
            disabled={loadingEvaluation}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}
