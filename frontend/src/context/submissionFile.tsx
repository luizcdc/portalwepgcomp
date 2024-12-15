import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { submissionFileApi } from "@/services/submissionFile";

interface SubmissionFileProps {
    children: ReactNode;
}

interface SubmissionFileProviderData {
    loadingSubmissionFileList: boolean;
    loadingSubmissionFile: boolean;
    submissionFileList: SubmissionFile[];
    submissionFile: SubmissionFile | null;
    getFiles: () => Promise<void>;
    sendFile: (file: File, idSubmission: string) => Promise<void>;
}

export const SubmissionFileContext = createContext<SubmissionFileProviderData>(
    {} as SubmissionFileProviderData
)

export const SubmissionFileProvider = ({ children }: SubmissionFileProps) => {
    const [loadingSubmissionFileList, setLoadingSubmissionFileList] = useState<boolean>(false);
    const [loadingSubmissionFile, setLoadingSubmissionFile] = useState<boolean>(false);
    const [submissionFileList, setSubmissionFileList] = useState<SubmissionFile[]>([]);
    const [submissionFile, setSubmissionFile] = useState<SubmissionFile | null>(null);

    const { showAlert } = useSweetAlert();

    const getFiles = async () => {
        setLoadingSubmissionFileList(true);

        try {
            const response = await submissionFileApi.getFiles();
            setSubmissionFileList(response);
        } catch (err: any) {
            console.error(err);
            setSubmissionFileList([]);

            showAlert({
                icon: "error",
                title: "Erro ao listar arquivos",
                text:
                    err.response?.data?.message ||
                    "Ocorreu um erro durante a busca.",
                confirmButtonText: "Retornar",
            });
        } finally {
            setLoadingSubmissionFileList(false);
        }
    }

    const sendFile = async (file: File, idUser: string) => {
        setLoadingSubmissionFile(true);

        try {
            const response = await submissionFileApi.sendFile(file, idUser);
            setSubmissionFile(response);
        } catch (err: any) {
            console.error(err);
            setSubmissionFile(null);
        } finally {
            setLoadingSubmissionFile(false);
        }
    }

    return (
        <SubmissionFileContext.Provider
            value={{
                loadingSubmissionFileList,
                loadingSubmissionFile,
                submissionFileList,
                submissionFile,
                getFiles,
                sendFile
            }}
        >
            {children}
        </SubmissionFileContext.Provider>
    )
}