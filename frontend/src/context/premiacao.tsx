import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { premiacaoApi } from "@/services/premiacao";

interface SubmissionProps {
    children: ReactNode;
}

interface PremiacaoProviderData {
    loadingPremiacaoList: boolean,
    loadingpremiacao: boolean,
    premiacaoListBanca: PremiacaoCategoriaProps[];
    premiacaoListAudiencia: PremiacaoCategoriaProps[];
    premiacaoListAvaliadores: PremiacaoCategoriaProps[];
    getPremiacoesBanca: (eventId: string) => void;
    getPremiacoesAudiencia: (eventId: string) => void;
}

export const PremiacaoContext = createContext<PremiacaoProviderData>(
    {} as PremiacaoProviderData
);

export const PremiacaoProvider = ({ children }: SubmissionProps) => {
    const [loadingPremiacaoList, setLoadingPremiacaoList] = useState<boolean>(false);
    const [loadingpremiacao, setLoadingpremiacao] = useState<boolean>(false);
    const [premiacaoListBanca, setPremiacaoListBanca] = useState<PremiacaoCategoriaProps[]>([]);
    const [premiacaoListAudiencia, setPremiacaoListAudiencia] = useState<PremiacaoCategoriaProps[]>([]);
    const [premiacaoListAvaliadores, setPremiacaoListAvaliadores] = useState<PremiacaoCategoriaProps[]>([]);


    const { showAlert } = useSweetAlert();

    const getPremiacoesBanca = async (eventId: string) => {
        setLoadingPremiacaoList(true);

        try {
            const response = await premiacaoApi.listTopPanelistsById(eventId);
            setLoadingpremiacao(response);
            setPremiacaoListBanca(response);
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

    const getPremiacoesAudiencia = async (eventId: string) => {
        setLoadingPremiacaoList(true);

        try {
            const response = await premiacaoApi.listTopAudienceById(eventId);
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
                premiacaoListBanca,
                premiacaoListAudiencia,
                premiacaoListAvaliadores,
                getPremiacoesBanca,
                getPremiacoesAudiencia,
            }}
        >
            {children}
        </PremiacaoContext.Provider>
    );
};