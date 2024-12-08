"use client";

import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { orientacoesApi } from "@/services/orientacoes";

interface OrientacaoProps {
  children: ReactNode;
}

interface OrientacaoProviderData {
  loadingOrientacoes: boolean;
  loadingOrientacao: boolean;
  orientacoes: Orientacao | null;
  orientacao: Orientacao | null;
  getOrientacoes: () => void;
  getOrientacaoById: (idOrientacao: string) => void;
  postOrientacao: (body: OrientacaoParams) => void;
  putOrientacao: (idOrientacao: string, body: OrientacaoParams) => void;
  deleteOrientacao: (idOrientacao: string) => void;
}

export const OrientacaoContext = createContext<OrientacaoProviderData>(
  {} as OrientacaoProviderData
);

export const OrientacaoProvider = ({ children }: OrientacaoProps) => {
  const [loadingOrientacoes, setLoadingOrientacoes] = useState<boolean>(false);
  const [loadingOrientacao, setLoadingOrientacao] = useState<boolean>(false);
  const [orientacoes, setOrientacoes] = useState<Orientacao | null>(null);
  const [orientacao, setOrientacao] = useState<Orientacao | null>(null);

  const { showAlert } = useSweetAlert();

  const getOrientacoes = async () => {
    setLoadingOrientacoes(true);
    orientacoesApi
      .getOrientacoes()
      .then((response) => {
        setOrientacoes(response);
      })
      .catch((err) => {
        console.log(err);
        setOrientacoes(null);
      })
      .finally(() => {
        setLoadingOrientacoes(false);
      });
  };

  const getOrientacaoById = async (idOrientacao: string) => {
    setLoadingOrientacoes(true);
    orientacoesApi
      .getOrientacaoById(idOrientacao)
      .then((response) => {
        setOrientacao(response);
        console.log("encontrado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setOrientacao(null);
        console.log("erro ao buscar");
        alert("Erro ao tentar buscar!");
      })
      .finally(() => {
        setLoadingOrientacoes(false);
      });
  };

  const postOrientacao = async (body: OrientacaoParams) => {
    setLoadingOrientacao(true);

    orientacoesApi
      .postOrientacao(body)
      .then((response) => {
        setOrientacao(response);
        console.log("criado com sucesso");
        showAlert({
          icon: "success",
          title: "Cadastro realizado com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setOrientacao(null);
        console.log("erro ao criar");
        showAlert({
          icon: "error",
          title: "Erro ao cadastrar orientação",
          text:
            err.response?.data?.message ||
            "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
      })
      .finally(() => {
        setLoadingOrientacao(false);
      });
  };

  const putOrientacao = async (
    idOrientacao: string,
    body: OrientacaoParams
  ) => {
    setLoadingOrientacao(true);
    orientacoesApi
      .putOrientacao(idOrientacao, body)
      .then((response) => {
        setOrientacao(response);
        console.log("atualizado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setOrientacao(null);
        console.log("erro ao atualizar");
        alert("Erro ao tentar atualizar!");
      })
      .finally(() => {
        setLoadingOrientacao(false);
      });
  };

  const deleteOrientacao = async (idOrientacao: string) => {
    setLoadingOrientacao(true);
    orientacoesApi
      .deleteOrientacaoById(idOrientacao)
      .then((response) => {
        console.log(response);

        showAlert({
          icon: "success",
          title: "Sessão deletada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        getOrientacoes();
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao deletar sessão",
          text:
            err.response?.data?.message ||
            "Ocorreu um erro durante a deleção. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
      })
      .finally(() => {
        setOrientacao(null);
        setLoadingOrientacao(false);
      });
  };

  return (
    <OrientacaoContext.Provider
      value={{
        loadingOrientacao,
        loadingOrientacoes,
        orientacoes,
        orientacao,
        getOrientacoes,
        getOrientacaoById,
        postOrientacao,
        putOrientacao,
        deleteOrientacao,
      }}
    >
      {children}
    </OrientacaoContext.Provider>
  );
};
