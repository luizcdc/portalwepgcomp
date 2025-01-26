"use client";

import { createContext, ReactNode, useState } from "react";
import { evaluationApi } from "@/services/evaluation";
import { useSweetAlert } from "@/hooks/useAlert";
import { useRouter } from "next/navigation";

interface EvaluationProps {
  children: ReactNode;
}

interface EvaluationProviderData {
  loadingEvaluation: boolean;
  loadingEvaluationCriteria: boolean;
  evaluations: Evaluation[];
  evaluationCriteria: EvaluationCriteria[];
  getEvaluations: (submissionId: string) => void;
  getEvaluationByUser: (userId: string) => void;
  makeEvaluation: (body: EvaluationParams[]) => void;
  getEvaluationCriteria: (eventEditionId: string) => void;
  createEvaluationCriteria: (
    body: EvaluationCriteriaParams[]
  ) => Promise<boolean>;
  updateEvaluationCriteria: (
    body: EvaluationCriteriaParams[]
  ) => Promise<boolean>;
}

export const EvaluationContext = createContext<EvaluationProviderData>(
  {} as EvaluationProviderData
);

export const EvaluationProvider = ({ children }: EvaluationProps) => {
  const [loadingEvaluation, setLoadingEvaluation] = useState<boolean>(false);
  const [loadingEvaluationCriteria, setLoadingEvaluationCriteria] =
    useState<boolean>(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evaluationCriteria, setEvaluationCriteria] = useState<
    EvaluationCriteria[]
  >([]);

  const { showAlert } = useSweetAlert();

  const router = useRouter();

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
        router.push("/home");
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

  const createEvaluationCriteria = async (body: EvaluationCriteriaParams[]) => {
    setLoadingEvaluationCriteria(true);
    return evaluationApi
      .createEvaluationCriteria(body)
      .then(() => {
        showAlert({
          icon: "success",
          title: "Critérios criados com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        const modalElementButton = document.getElementById(
          "criteriosModalClose"
        ) as HTMLButtonElement;

        if (modalElementButton) {
          modalElementButton.click();
        }

        return true;
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao criar",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante a criação. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
        return false;
      })
      .finally(() => {
        setLoadingEvaluationCriteria(false);
      });
  };

  const updateEvaluationCriteria = async (body: EvaluationCriteriaParams[]) => {
    setLoadingEvaluationCriteria(true);
    return evaluationApi
      .updateEvaluationCriteria(body)
      .then(() => {
        showAlert({
          icon: "success",
          title: "Avaliação atualizada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
        const modalElementButton = document.getElementById(
          "criteriosModalClose"
        ) as HTMLButtonElement;

        if (modalElementButton) {
          modalElementButton.click();
        }

        return true;
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao atualizar",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante a atualização. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
        return false;
      })
      .finally(() => {
        setLoadingEvaluationCriteria(false);
      });
  };

  return (
    <EvaluationContext.Provider
      value={{
        loadingEvaluation,
        loadingEvaluationCriteria,
        evaluations,
        evaluationCriteria,
        makeEvaluation,
        getEvaluationByUser,
        getEvaluations,
        getEvaluationCriteria,
        createEvaluationCriteria,
        updateEvaluationCriteria,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};
