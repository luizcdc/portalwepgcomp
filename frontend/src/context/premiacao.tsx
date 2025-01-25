import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { premiacaoApi } from "@/services/premiacao";

interface SubmissionProps {
  children: ReactNode;
}

interface PremiacaoProviderData {
  loadingPremiacaoList: boolean;
  loadingpremiacao: boolean;
  premiacaoListBanca: Premiacoes[];
  premiacaoListAudiencia: Premiacoes[];
  premiacaoListAvaliadores: AuthorOrEvaluator[];
  premiacaoAvaliadores: AvaliadorParams[];
  getPremiacoesBanca: (eventId: string) => void;
  getPremiacoesAudiencia: (eventId: string) => void;
  getPremiacoesAvaliadores: (eventId: string) => void;
  createAwardedPanelists: (body: AvaliadorParams) => Promise<boolean>;
}

export const PremiacaoContext = createContext<PremiacaoProviderData>(
  {} as PremiacaoProviderData
);

export const PremiacaoProvider = ({ children }: SubmissionProps) => {
  const [loadingPremiacaoList, setLoadingPremiacaoList] =
    useState<boolean>(false);
  const [loadingpremiacao, setLoadingpremiacao] = useState<boolean>(false);
  const [premiacaoListBanca, setPremiacaoListBanca] = useState<Premiacoes[]>(
    []
  );
  const [premiacaoListAudiencia, setPremiacaoListAudiencia] = useState<
    Premiacoes[]
  >([]);
  const [premiacaoListAvaliadores, setPremiacaoListAvaliadores] = useState<
    AuthorOrEvaluator[]
  >([]);
  const [premiacaoAvaliadores, setPremiacaoAvaliadores] = useState<
    AvaliadorParams[]
  >([]);

  const { showAlert } = useSweetAlert();

  const getPremiacoesBanca = async (eventId: string) => {
    setLoadingPremiacaoList(true);

    try {
      const response = await premiacaoApi.listTopPanelistsById(eventId);
      setLoadingpremiacao(response);
      setPremiacaoListBanca(response);
      return response;
    } catch (err: any) {
      setLoadingpremiacao(false);

      showAlert({
        icon: "error",
        title: "Erro ao listar premiações",
        text: err.response?.data?.message || "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingPremiacaoList(false);
    }
  };

  const getPremiacoesAudiencia = async (eventId: string) => {
    setLoadingPremiacaoList(true);

    try {
      const response = await premiacaoApi.listTopAudienceById(eventId);
      setLoadingpremiacao(response);
      setPremiacaoListAudiencia(response);
      return response;
    } catch (err: any) {
      setLoadingpremiacao(false);

      showAlert({
        icon: "error",
        title: "Erro ao listar premiações",
        text: err.response?.data?.message || "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingPremiacaoList(false);
    }
  };

  const getPremiacoesAvaliadores = async (eventId: string) => {
    setLoadingPremiacaoList(true);

    try {
      const response = await premiacaoApi.listAwardedPanelistsById(eventId);
      setLoadingpremiacao(response);
      setPremiacaoListAvaliadores(response);
      return response;
    } catch (err: any) {
      setLoadingpremiacao(false);

      showAlert({
        icon: "error",
        title: "Erro ao listar premiações",
        text: err.response?.data?.message || "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingPremiacaoList(false);
    }
  };

  const createAwardedPanelists = async (
    body: AvaliadorParams
  ): Promise<boolean> => {
    setLoadingPremiacaoList(true);
    try {
      const response = await premiacaoApi.createAwardedPanelists(body);
      setPremiacaoAvaliadores(response);
      setLoadingpremiacao(response);

      showAlert({
        icon: "success",
        title: "Avaliadores salvos com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
      return true;
    } catch (err: any) {
      console.error(err);

      showAlert({
        icon: "error",
        title: "Erro ao salvar os avaliadores",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a escolha dos avaliadores. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
      return false;
    } finally {
      setLoadingPremiacaoList(false);
    }
  };

  return (
    <PremiacaoContext.Provider
      value={{
        loadingPremiacaoList,
        loadingpremiacao,
        premiacaoListBanca,
        premiacaoListAudiencia,
        premiacaoListAvaliadores,
        premiacaoAvaliadores,
        getPremiacoesBanca,
        getPremiacoesAudiencia,
        getPremiacoesAvaliadores,
        createAwardedPanelists,
      }}
    >
      {children}
    </PremiacaoContext.Provider>
  );
};
