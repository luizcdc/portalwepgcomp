"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactNode, useState } from "react";

import { edicaoApi } from "@/services/edicao";
import { useSweetAlert } from "@/hooks/useAlert";

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
    setLoadingEdicoesList(true);
    edicaoApi
      .listEdicao()
      .then((response) => {
        setEdicoesList(response);
        setEdicao(response[0]);
      })
      .catch((err) => {
        console.log(err);
        setEdicoesList([]);
        setEdicao(null);
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
      })
      .catch((err) => {
        console.log(err);
        setEdicao(null);
      })
      .finally(() => {
        setLoadingEdicao(false);
      });
  };

  const getEdicaoByYear = async (year: string) => {
    setLoadingEdicao(true);
    edicaoApi
      .getEdicaoByYear(year)
      .then((response) => {
        setEdicao(response);
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
        showAlert({
          icon: "success",
          title: "Atualização realizada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        setEdicao(null);
        showAlert({
          icon: "error",
          title: "Erro ao atualizar informações do evento",
          text:
            err.response?.data?.message ||
            "Ocorreu um erro durante a atualização. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
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
