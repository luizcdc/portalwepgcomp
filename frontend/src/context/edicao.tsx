"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

import { edicaoApi } from "@/services/edicao";
import { useSweetAlert } from "@/hooks/useAlert";
import { setEventEditionIdStorage } from "./AuthProvider/util";

interface EdicaoProps {
  children: ReactNode;
}

interface EdicaoProviderData {
  loadingEdicoesList: boolean;
  loadingEdicao: boolean;
  edicoesList: Edicao[];
  Edicao: Edicao | null;
  setEdicao: Dispatch<SetStateAction<Edicao | null>>;
  listEdicao: () => Promise<Edicao[]>;
  getEdicaoById: (idEdicao: string) => void;
  getEdicaoByYear: (year: string) => void;
  createEdicao: (body: EdicaoParams) => Promise<boolean>;
  updateEdicao: (idEdicao: string, body: EdicaoParams) => void;
  updateEdicaoActivate: (idEdicao: string, body: EdicaoParams) => void;
  deleteEdicao: (idEdicao: string) => Promise<boolean>;
}

export const EdicaoContext = createContext<EdicaoProviderData>(
  {} as EdicaoProviderData
);

export const EdicaoProvider = ({ children }: EdicaoProps) => {
  const [loadingEdicoesList, setLoadingEdicoesList] = useState<boolean>(false);
  const [loadingEdicao, setLoadingEdicao] = useState<boolean>(false);
  const [edicoesList, setEdicoesList] = useState<Edicao[]>([]);
  const [Edicao, setEdicao] = useState<Edicao | null>(null);

  const { showAlert } = useSweetAlert();

  const listEdicao = async () => {
    setLoadingEdicoesList(true);

    try {
      const response = await edicaoApi.listEdicao();
      setEdicoesList(response);
      return response;
    } catch (err: any) {
      setEdicoesList([]);
      return [];
    } finally {
      setLoadingEdicoesList(false);
    }
  };

  const getEdicaoById = async (idEdicao: string) => {
    setLoadingEdicao(true);

    try {
      const response = await edicaoApi.getEdicaoById(idEdicao);
      setEdicao(response);
    } catch (err: any) {
      setEdicao(null);
    } finally {
      setLoadingEdicao(false);
    }
  };

  const getEdicaoByYear = async (year: string) => {
    setLoadingEdicao(true);

    try {
      const response = await edicaoApi.getEdicaoByYear(year);
      setEdicao(response);
      setEventEditionIdStorage(response.id);
    } catch (err: any) {
      setEdicao(null);
    } finally {
      setLoadingEdicao(false);
    }
  };

  const createEdicao = async (body: EdicaoParams): Promise<boolean> => {
    setLoadingEdicao(true);
    try {
      const response = await edicaoApi.createEdicao(body);
      setEdicao(response);

      showAlert({
        icon: "success",
        title: "Edição cadastrada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
      return true;
    } catch (err: any) {
      console.error(err);
      setEdicao(null);

      showAlert({
        icon: "error",
        title: "Erro ao cadastrar Edição",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
      return false;
    } finally {
      setLoadingEdicao(false);
    }
  };

  const updateEdicao = async (idEdicao: string, body: EdicaoParams) => {
    setLoadingEdicao(true);
    try {
      const response = await edicaoApi.updateEdicaoById(idEdicao, body);
      setEdicao(response);

      showAlert({
        icon: "success",
        title: "Edição atualizada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setEdicao(null);

      showAlert({
        icon: "error",
        title: "Erro ao atualizar a Edição",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a atualizar. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingEdicao(false);
    }
  };

  const updateEdicaoActivate = async (idEdicao: string, body: EdicaoParams) => {
    setLoadingEdicao(true);
    try {
      const response = await edicaoApi.updateEdicaoActivate(idEdicao, body);
      setEdicao(response);

      showAlert({
        icon: "success",
        title: "Edição atualizada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);
      setEdicao(null);

      showAlert({
        icon: "error",
        title: "Erro ao atualizar a Edição",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a edição. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingEdicao(false);
    }
  };

  const deleteEdicao = async (idEdicao: string): Promise<boolean> => {
    setLoadingEdicao(true);

    try {
      const response = await edicaoApi.deleteEdicaoById(idEdicao);
      setLoadingEdicao(response);

      showAlert({
        icon: "success",
        title: "Edição removida com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
      return true;
    } catch (err: any) {
      console.error(err);
      setEdicao(null);

      showAlert({
        icon: "error",
        title: "Erro ao remover a Edição",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a remoção. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
      return false;
    } finally {
      setLoadingEdicao(false);
    }
  };

  return (
    <EdicaoContext.Provider
      value={{
        loadingEdicao,
        loadingEdicoesList,
        Edicao,
        edicoesList,
        setEdicao,
        listEdicao,
        getEdicaoById,
        getEdicaoByYear,
        createEdicao,
        updateEdicao,
        updateEdicaoActivate,
        deleteEdicao,
      }}
    >
      {children}
    </EdicaoContext.Provider>
  );
};
