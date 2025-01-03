"use client";

import { createContext, ReactNode, useState } from "react";
import { evaluationApi } from "@/services/evaluation";
import { useSweetAlert } from "@/hooks/useAlert";

interface EvaluationProps {
  children: ReactNode;
}

interface EvaluationProviderData {
  loadingEvaluation: boolean;
  evaluations: Evaluation[];
  evaluationCriteria: EvaluationCriteria[];
  getEvaluations: (submissionId: string) => void;
  getEvaluationByUser: (userId: string) => void;
  makeEvaluation: (body: EvaluationParams[]) => void;
  getEvaluationCriteria: (eventEditionId: string) => void;
}

export const EvaluationContext = createContext<EvaluationProviderData>(
  {} as EvaluationProviderData
);

export const EvaluationProvider = ({ children }: EvaluationProps) => {
  const [loadingEvaluation, setLoadingEvaluation] = useState<boolean>(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evaluationCriteria, setEvaluationCriteria] = useState<
    EvaluationCriteria[]
  >([]);

  const { showAlert } = useSweetAlert();

  const makeEvaluation = async (body: EvaluationParams[]) => {
    setLoadingEvaluation(true);
    evaluationApi
      .makeEvaluation(body)
      .then((response) => {
        setEvaluations(response);
        showAlert({
          icon: "success",
          title: "Avaliação realizada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        setEvaluations([]);
        showAlert({
          icon: "error",
          title: "Erro ao avaliar",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante a avaliação. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
      })
      .finally(() => {
        setLoadingEvaluation(false);
      });
  };

  const getEvaluationByUser = async (userId: string) => {
    setLoadingEvaluation(true);
    evaluationApi
      .getEvaluationByUser(userId)
      .then((response) => {
        setEvaluations(response);
      })
      .catch(() => {
        setEvaluations([]);
      })
      .finally(() => {
        setLoadingEvaluation(false);
      });
  };

  const getEvaluations = async (submissionId: string) => {
    setLoadingEvaluation(true);
    evaluationApi
      .getEvaluation(submissionId)
      .then((response) => {
        setEvaluations(response);
      })
      .catch(() => {
        setEvaluations([]);
      })
      .finally(() => {
        setLoadingEvaluation(false);
      });
  };

  const getEvaluationCriteria = async (eventEditionId: string) => {
    setLoadingEvaluation(true);
    evaluationApi
      .getEvaluationCriteria(eventEditionId)
      .then((response) => {
        setEvaluationCriteria(response);
      })
      .catch(() => {
        setEvaluationCriteria([]);
      })
      .finally(() => {
        setLoadingEvaluation(false);
      });
  };

  return (
    <EvaluationContext.Provider
      value={{
        loadingEvaluation,
        evaluations,
        evaluationCriteria,
        makeEvaluation,
        getEvaluationByUser,
        getEvaluations,
        getEvaluationCriteria,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
