"use client"

import { createContext, ReactNode, useState } from "react"
import { evaluationApi } from "@/services/evaluation"
import { useSweetAlert } from "@/hooks/useAlert";

interface EvaluationProps{
    children: ReactNode;
}

interface EvaluationProviderData{
    loadingEvaluation: boolean;
    evaluation: Evaluation | null;
    getEvaluation: (submissionId: string) => void;
    createEvaluation: (body: EvaluationParams) => void;
}

export const EvaluationContext = createContext<EvaluationProviderData>(
    {} as EvaluationProviderData
);

export const EvaluationProvider = ({children}: EvaluationProps) => {
    const [loadingEvaluation, setLoadingEvaluation] = useState<boolean>(false);
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

    const { showAlert } = useSweetAlert();

    const createEvaluation = async (body: EvaluationParams) => {
        setLoadingEvaluation(true);
        evaluationApi
        .createEvaluation(body)
        .then((response) => {
            setEvaluation(response);
            showAlert({
                icon: "success",
                title: "Avaliação realizada com sucesso!",
                timer: 3000,
                showConfirmButton: false,
              });
        })
        .catch((err) => {
            setEvaluation(null);
            showAlert({
                icon: "error",
                title: "Erro ao avaliar",
                text:
                  err.response?.data?.message ||
                  "Ocorreu um erro durante a avaliação. Tente novamente mais tarde!",
                confirmButtonText: "Retornar",
              });
        })
        .finally(() => {
            setLoadingEvaluation(false);
        })
    }

    const getEvaluation = async (submissionId: string) => {
        setLoadingEvaluation(true);
        evaluationApi
        .getEvaluation(submissionId)
        .then((response) => {
            setEvaluation(response);
        })
        .catch((err) => {
            setEvaluation(null);
        })
        .finally(() => {
            setLoadingEvaluation(false);
        })
    }

    return(
        <EvaluationContext.Provider 
        value={{
            loadingEvaluation,
            evaluation,
            createEvaluation,
            getEvaluation
        }}>
            {children}
        </EvaluationContext.Provider>

    );
}