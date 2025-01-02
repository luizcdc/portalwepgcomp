import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { premiacaoApi } from "@/services/premiacao";

interface SubmissionProps {
    children: ReactNode;
}

interface PremiacaoProviderData {
    loadingPremiacaoList: boolean,
    loadingpremiacao: boolean,
    premiacaoListBanca: Premiacoes[];
    premiacaoListAudiencia: Premiacoes[];
    premiacaoListAvaliadores: AuthorOrEvaluator[];
    getPremiacoesBanca: (eventId: string) => void;
    getPremiacoesAudiencia: (eventId: string) => void;
    getPremiacoesAvaliadores: (eventId: string) => void;
}

export const PremiacaoContext = createContext<PremiacaoProviderData>(
    {} as PremiacaoProviderData
);

export const PremiacaoProvider = ({ children }: SubmissionProps) => {
    const [loadingPremiacaoList, setLoadingPremiacaoList] = useState<boolean>(false);
    const [loadingpremiacao, setLoadingpremiacao] = useState<boolean>(false);
    const [premiacaoListBanca, setPremiacaoListBanca] = useState<Premiacoes[]>([]);
    const [premiacaoListAudiencia, setPremiacaoListAudiencia] = useState<Premiacoes[]>([]);
    const [premiacaoListAvaliadores, setPremiacaoListAvaliadores] = useState<AuthorOrEvaluator[]>([]);


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
            setPremiacaoListAudiencia(response);
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

    const getPremiacoesAvaliadores = async (eventId: string) => {
        setLoadingPremiacaoList(true);

        try {
            const response = await premiacaoApi.listAwardedPanelistsById(eventId);
            setLoadingpremiacao(response);
            setPremiacaoListAvaliadores(response);
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
                getPremiacoesAvaliadores,
            }}
        >
            {children}
        </PremiacaoContext.Provider>
    );
};