import { UUID } from "crypto";
import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { GetSubmissionParams, Submission, SubmissionParams } from "@/models/submission";
import { submissionApi } from "@/services/submission";

interface SubmissionProps {
    children: ReactNode;
}

interface SubmissionProviderData {
    loadingSubmissionList: boolean;
    loadingSubmission: boolean;
    submissionList: Submission[];
    submission: Submission | null;
    getSubmissions: (params: GetSubmissionParams) => void;
    getSubmissionById: (idSubmission: UUID) => void;
    createSubmission: (body: SubmissionParams) => void;
    updateSubmissionById: (idSubmission: UUID, body: SubmissionParams) => void;
    deleteSubmissionById: (idSubmission: UUID) => void;
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

    const getSubmissions = async (params: GetSubmissionParams) => {
        setLoadingSubmissionList(true);

        try {
            const response = await submissionApi.getSubmissions(params);
            setSubmissionList(response);
            console.log("Listado com sucesso");
        } catch (err: any) {
            console.error(err);
            setSubmissionList([]);
            console.log("Erro ao tentar listar");

            showAlert({
                icon: "error",
                title: "Erro ao listar apresentações",
                text:
                    err.response?.data?.message ||
                    "Ocorreu um erro durante a busca.",
                confirmButtonText: "Retornar",
            });
        } finally {
            setLoadingSubmissionList(false);
        }
    }

    const getSubmissionById = async (idSubmission: UUID) => {
        setLoadingSubmission(true);

        try {
            const response = await submissionApi.getSubmissionById(idSubmission);
            setSubmission(response);
            console.log("Encontrado com sucesso");
        } catch (err: any) {
            console.error(err);
            setSubmission(null);
            console.log("Erro ao buscar");

            showAlert({
                icon: "error",
                title: "Erro ao buscar apresentação",
                text:
                    err.response?.data?.message ||
                    "Ocorreu um erro durante a busca.",
                confirmButtonText: "Retornar",
            });
        } finally {
            setLoadingSubmission(false);
        }
    }

    const createSubmission = async (body: SubmissionParams) => {
        setLoadingSubmission(true);

        try {
            const response = await submissionApi.createSubmission(body);
            setSubmission(response);

            showAlert({
                icon: "success",
                title: "Apresentação cadastrada com sucesso!",
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (err: any) {
            console.error(err);
            setSubmission(null);
            console.log("Erro ao cadastrar apresentação")

            showAlert({
                icon: "error",
                title: "Erro ao cadastrar apresentação",
                text:
                    err.response?.data?.message ||
                    "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
                confirmButtonText: "Retornar",
            });
        } finally {
            setLoadingSubmission(false);
        }
    }

    const updateSubmissionById = async (idSubmission: UUID, body: SubmissionParams) => {
        setLoadingSubmission(true);

        try {
            const response = await submissionApi.updateSubmissionById(idSubmission, body);
            setSubmission(response);

            showAlert({
                icon: "success",
                title: "Apresentação editada com sucesso!",
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (err: any) {
            console.error(err);
            setSubmission(null);
            console.log("Erro ao editar");

            showAlert({
                icon: "error",
                title: "Erro ao editar apresentação",
                text:
                    err.response?.data?.message ||
                    "Ocorreu um erro durante a edição. Tente novamente mais tarde!",
                confirmButtonText: "Retornar",
            });
        } finally {
            setLoadingSubmission(false);
        }
    }

    const deleteSubmissionById = async (idSubmission: UUID) => {
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
            console.error(err);
            setSubmission(null);
            console.log("Erro ao remover");

            showAlert({
                icon: "error",
                title: "Erro ao remover apresentação",
                text:
                    err.response?.data?.message ||
                    "Ocorreu um erro durante a remoção. Tente novamente mais tarde!",
                confirmButtonText: "Retornar",
            });
        } finally {
            setLoadingSubmission(false);
        }
    }

    return (
        <SubmissionContext.Provider
            value={{
                loadingSubmission,
                loadingSubmissionList,
                submission,
                submissionList,
                getSubmissions,
                getSubmissionById,
                createSubmission,
                updateSubmissionById,
                deleteSubmissionById,
            }}
        >
            {children}
        </SubmissionContext.Provider>
    );
};