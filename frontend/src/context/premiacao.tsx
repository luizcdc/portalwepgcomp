import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { premiacaoApi } from "@/services/premiacao";

interface SubmissionProps {
    children: ReactNode;
}

interface PremiacaoProviderData {
    loadingPremiacaoList: boolean,
    loadingpremiacao: boolean,
    premiacaoList: PremiacaoCategoriaProps[];
    getPremiacoes: (eventId: string) => void;
}

export const PremiacaoContext = createContext<PremiacaoProviderData>(
    {} as PremiacaoProviderData
);

export const PremiacaoProvider = ({ children }: SubmissionProps) => {
    const [loadingPremiacaoList, setLoadingPremiacaoList] = useState<boolean>(false);
    const [loadingpremiacao, setLoadingpremiacao] = useState<boolean>(false);
    const [premiacaoList, setPremiacaoList] = useState<PremiacaoCategoriaProps[]>([]);

    const { showAlert } = useSweetAlert();

    const getPremiacoes = async (eventId: string) => {
        setLoadingPremiacaoList(true);

        try {
            const response = await premiacaoApi.listAvaliadoresById(eventId);
            setLoadingpremiacao(response);
            return response;
        } catch (err: any) {
            console.error(err);
            setLoadingpremiacao(false);

            showAlert({
                icon: "error",
                title: "Erro ao listar premiações",
                text:
                    err.response?.data?.message ||
                    "Ocorreu um erro durante a busca.",
                confirmButtonText: "Retornar",
            });
        } finally {
            setLoadingPremiacaoList(false);
        }
    }


    return (
        <PremiacaoContext.Provider
            value={{
                loadingPremiacaoList,
                loadingpremiacao,
                premiacaoList,
                getPremiacoes,
            }}
        >
            {children}
        </PremiacaoContext.Provider>
    );
};