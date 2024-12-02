import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { Submission, SubmissionParams } from "@/models/submission";
import { submissionApi } from "@/services/submission";

interface SubmissionProps {
    children: ReactNode;
}

interface SubmissionProviderData {
    loadingSubmissionList: boolean;
    loadingSubmission: boolean;
    submissionList: Submission[];
    submission: Submission | null;
    createSubmission: (body: SubmissionParams) => void;
    getSubmissions: () => void;
    getSubmissionById: (idSubmission: string) => void;
    deleteSubmission: (idSubmission: string) => void;
}

export const SubmissionContext = createContext<SubmissionProviderData>(
    {} as SubmissionProviderData
);

export const SubmissionProvider = ({ children }: SubmissionProps) => {
    const [loadingSubmissionList, setLoadingSubmissionList] = useState<boolean>(false);
    const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);
    const [submissionList, setSubmissionList] = useState<Submission[]>([]);
    const [submission, setSubmission] = useState<Submission | null>(null);

    const { showAlert } = useSweetAlert();

    const createSubmission = async (body: SubmissionParams) => {
        setLoadingSubmission(true);

        try {
            const response = await submissionApi.createSubmission(body);
            setSubmission(response);

            showAlert({
                icon: "success",
                title: "Cadastro realizado com sucesso!",
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (err: any) {
            console.error(err);

            setSubmission(null);

            showAlert({
                icon: "error",
                title: "Erro ao cadastrar apresentação",
                text: err.response?.data?.message || "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
                confirmButtonText: 'Retornar',
            });
        } finally {
            setLoadingSubmission(false);
        }
    };

    const getSubmissions = async () => {
        setLoadingSubmissionList(true);

        try {
            const response = await submissionApi.getSubmissions();
            setSubmissionList(response);

            console.log("Listado com sucesso!")
        } catch (err: any) {
            console.error("Erro ao listar", err);
            setSubmissionList([]);

            showAlert({
                icon: "error",
                title: "Erro ao listar apresentações",
                text: err.response?.data?.message || "Ocorreu um erro durante a listagem. Tente novamente mais tarde!",
                confirmButtonText: 'Retornar',
            });
        } finally {
            setLoadingSubmissionList(false);
        };
    }

    const getSubmissionById = async (idSubmission: string) => {
        setLoadingSubmission(true);

        try {
            const response = await submissionApi.getSubmissionById(idSubmission);
            setSubmission(response);

            console.log("Encontra com sucesso!");
        } catch (err: any) {
            console.error("Erro ao buscar:", err);

            setSubmission(null);

            showAlert({
                icon: "error",
                title: "Erro ao buscar apresentação",
                text: err.response?.data?.message || "Ocorreu um erro durante a busca. Tente novamente mais tarde!",
                confirmButtonText: 'Retornar',
            });
        } finally {
            setLoadingSubmission(false);
        }
    };

    const deleteSubmission = async (idSubmission: string) => {
        setLoadingSubmission(true);

        try {
            const response = await submissionApi.deleteSubmissionById(idSubmission);
            setSubmission(response);

            showAlert({
                icon: "success",
                title: "Apresentação removida com sucesso!",
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (err: any) {
            console.error("Erro ao deletar", err);
            setSubmission(null);
            showAlert({
                icon: "error",
                title: "Erro ao deletar apresentação",
                text: err.response?.data?.message || "Ocorreu um erro durante a remoção. Tente novamente mais tarde!",
                confirmButtonText: 'Retornar',
            });
        } finally {
            setLoadingSubmission(false);
        };
    }

    return (
        <SubmissionContext.Provider
            value={{
                loadingSubmissionList,
                loadingSubmission,
                submissionList,
                submission,
                createSubmission,
                getSubmissions,
                getSubmissionById,
                deleteSubmission,
            }}
        >
            {children}
        </SubmissionContext.Provider>
    )
}