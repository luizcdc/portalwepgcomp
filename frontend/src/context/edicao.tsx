"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactNode, useState } from "react";

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
  listEdicao: () => void;
  getEdicaoById: (idEdicao: string) => void;
  getEdicaoByYear: (year: string) => void;
  createEdicao: (body: EdicaoParams) => void;
  updateEdicao: (idEdicao: string, body: EdicaoParams) => void;
  updateEdicaoActivate: (idEdicao: string, body: EdicaoParams) => void;
  deleteEdicao: (idEdicao: string) => void;
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
    setLoadingEdicao(true);

    try {
      const response = await edicaoApi.listEdicao();
      setEdicoesList(response);
      setEdicao(response[0]);
      return response;
    } catch (err: any) {
      setEdicoesList([]);
      setEdicao(null);
      showAlert({
        icon: "error",
        title: "Erro ao listar apresentações",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
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
      showAlert({
        icon: "error",
        title: "Erro ao buscar edição",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingEdicoesList(false);
    }
  };

  const getEdicaoByYear = async (year: string) => {
    setLoadingEdicao(true);
    edicaoApi
      .getEdicaoByYear(year)
      .then((response) => {
        setEdicao(response);
        setEventEditionIdStorage(response.id);
      })
      .catch((err) => {
        console.log(err);
        setEdicao(null);
      })
      .finally(() => {
        setLoadingEdicao(false);
      });
  };

  const createEdicao = async (body: EdicaoParams) => {
    setLoadingEdicao(true);
    try {
      const response = await edicaoApi.createEdicao(body);
      setEdicao(response);

      showAlert({
        icon: "success",
        title: "Apresentação cadastrada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);
      setEdicao(null);

      showAlert({
        icon: "error",
        title: "Erro ao cadastrar apresentação",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
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
      console.error(err);
      setEdicao(null);

      showAlert({
        icon: "error",
        title: "Erro ao editar apresentação",
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
        title: "Erro ao editar apresentação",
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

  const deleteEdicao = async (idEdicao: string) => {
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
    } catch (err: any) {
      console.error(err);
      setEdicao(null);

      showAlert({
        icon: "error",
        title: "Erro ao remover apresentação",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a remoção. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
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
