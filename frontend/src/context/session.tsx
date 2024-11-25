"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, ReactNode, useState } from "react";

import { sessionApi } from "@/services/sessions";

interface SessionProps {
  children: ReactNode;
}

interface SessionProviderData {
  loadingSessoesList: boolean;
  loadingSessao: boolean;
  sessoesList: Sessao[];
  sessao: Sessao | null;
  listSessions: (eventEditionId: string) => void;
  getSessionById: (idSession: string) => void;
  createSession: (body: SessaoParams) => void;
  updateSession: (idSession: string, body: SessaoParams) => void;
  deleteSession: (idSession: string) => void;
}

export const SessionContext = createContext<SessionProviderData>(
  {} as SessionProviderData
);

export const SessionProvider = ({ children }: SessionProps) => {
  const [loadingSessoesList, setLoadingSessoesList] = useState<boolean>(false);
  const [loadingSessao, setLoadingSessao] = useState<boolean>(false);
  const [sessoesList, setSessoesList] = useState<Sessao[]>([]);
  const [sessao, setSessao] = useState<Sessao | null>(null);

  const listSessions = async (eventEditionId: string) => {
    setLoadingSessoesList(true);
    sessionApi
      .listSessions(eventEditionId)
      .then((response) => {
        setSessoesList(response);
        console.log("listado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setSessoesList([]);
        console.log("erro ao listar");
        alert("Erro ao tentar listar!");
      })
      .finally(() => {
        setLoadingSessoesList(false);
      });
  };

  const getSessionById = async (idSession: string) => {
    setLoadingSessao(true);
    sessionApi
      .getSessionById(idSession)
      .then((response) => {
        setSessao(response);
        console.log("encontrado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setSessao(null);
        console.log("erro ao buscar");
        alert("Erro ao tentar buscar!");
      })
      .finally(() => {
        setLoadingSessao(false);
      });
  };

  const createSession = async (body: SessaoParams) => {
    setLoadingSessao(true);
    sessionApi
      .createSession(body)
      .then((response) => {
        setSessao(response);
        console.log("criado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setSessao(null);
        console.log("erro ao criar");
        alert("Erro ao tentar cadastrar!");
      })
      .finally(() => {
        setLoadingSessao(false);
      });
  };

  const updateSession = async (idSession: string, body: SessaoParams) => {
    setLoadingSessao(true);
    sessionApi
      .updateSessionById(idSession, body)
      .then((response) => {
        setSessao(response);
        console.log("atualizado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setSessao(null);
        console.log("erro ao atualizar");
        alert("Erro ao tentar atualizar!");
      })
      .finally(() => {
        setLoadingSessao(false);
      });
  };

  const deleteSession = async (idSession: string) => {
    setLoadingSessao(true);
    sessionApi
      .deleteSessionById(idSession)
      .then((response) => {
        setSessao(response);
        console.log("atualizado com sucesso");
      })
      .catch((err) => {
        console.log(err);
        setSessao(null);
        console.log("erro ao deletar");
        alert("Erro ao tentar deletar!");
      })
      .finally(() => {
        setLoadingSessao(false);
      });
  };

  return (
    <SessionContext.Provider
      value={{
        loadingSessao,
        loadingSessoesList,
        sessao,
        sessoesList,
        listSessions,
        getSessionById,
        createSession,
        updateSession,
        deleteSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
