"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactNode, useState } from "react";

import { edicaoApi } from "@/services/edicao";

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

  const listEdicao = async () => {
    setLoadingEdicoesList(true);
    edicaoApi
      .listEdicao()
      .then((response) => {
        setEdicoesList(response);
        console.log("listado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setEdicoesList([]);
        console.log("erro ao listar");
        alert("Erro ao tentar listar!");
      })
      .finally(() => {
        setLoadingEdicoesList(false);
      });
  };

  const getEdicaoById = async (idEdicao: string) => {
    setLoadingEdicao(true);
    edicaoApi
      .getEdicaoById(idEdicao)
      .then((response) => {
        setEdicao(response);
        console.log("encontrado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setEdicao(null);
        console.log("erro ao buscar");
        alert("Erro ao tentar buscar!");
      })
      .finally(() => {
        setLoadingEdicao(false);
      });
  };

  const createEdicao = async (body: EdicaoParams) => {
    setLoadingEdicao(true);
    edicaoApi
      .createEdicao(body)
      .then((response) => {
        setEdicao(response);
        console.log("criado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setEdicao(null);
        console.log("erro ao criar");
        alert("Erro ao tentar cadastrar!");
      })
      .finally(() => {
        setLoadingEdicao(false);
      });
  };

  const updateEdicao = async (idEdicao: string, body: EdicaoParams) => {
    setLoadingEdicao(true);
    edicaoApi
      .updateEdicaoById(idEdicao, body)
      .then((response) => {
        setEdicao(response);
        console.log("atualizado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setEdicao(null);
        console.log("erro ao atualizar");
        alert("Erro ao tentar atualizar!");
      })
      .finally(() => {
        setLoadingEdicao(false);
      });
  };

  const updateEdicaoActivate = async (idEdicao: string, body: EdicaoParams) => {
    setLoadingEdicao(true);
    edicaoApi
      .updateEdicaoActivate(idEdicao, body)
      .then((response) => {
        setEdicao(response);
        console.log("atualizado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setEdicao(null);
        console.log("erro ao atualizar");
        alert("Erro ao tentar atualizar!");
      })
      .finally(() => {
        setLoadingEdicao(false);
      });
  };

  const deleteEdicao = async (idEdicao: string) => {
    setLoadingEdicao(true);
    edicaoApi
      .deleteEdicaoById(idEdicao)
      .then((response) => {
        setEdicao(response);
        console.log("atualizado com sucesso");
        listEdicao();
      })
      .catch((err) => {
        console.log(err);
        setEdicao(null);
        console.log("erro ao deletar");
        alert("Erro ao tentar deletar!");
      })
      .finally(() => {
        setLoadingEdicao(false);
      });
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
