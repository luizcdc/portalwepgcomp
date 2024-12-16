"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

import { sessionApi } from "@/services/sessions";
import { useSweetAlert } from "@/hooks/useAlert";

interface SessionProps {
  children: ReactNode;
}

interface SessionProviderData {
  loadingSessoesList: boolean;
  loadingSessao: boolean;
  sessoesList: Sessao[];
  presentationList: PresentationBlock[];
  sessao: Sessao | null;
  setSessao: Dispatch<SetStateAction<Sessao | null>>;
  listPresentations: (eventEditionId: string) => void;
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
  const [presentationList, setPresentationList] = useState<PresentationBlock[]>([]);

  const { showAlert } = useSweetAlert();

  const listPresentations = async (eventEditionId: string) => {
    setLoadingSessoesList(true);
    sessionApi
      .listSessions(eventEditionId)
      .then((response) => {        
        setPresentationList(response[0].presentations);
      })
      .catch((err) => {
        console.log(err);
        setPresentationList([]);
      })
      .finally(() => {
      });
  };

  const listSessions = async (eventEditionId: string) => {
    setLoadingSessoesList(true);
    sessionApi
      .listSessions(eventEditionId)
      .then((response) => {
        setSessoesList(response);
      })
      .catch((err) => {
        console.log(err);
        setSessoesList([]);
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
        showAlert({
          icon: "success",
          title: "Cadastro realizado com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setSessao(null);
        console.log("erro ao criar");
        showAlert({
          icon: "error",
          title: "Erro ao cadastrar sessão",
          text:
            err.response?.data?.message ||
            "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
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
        console.log(response);

        showAlert({
          icon: "success",
          title: "Sessão deletada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        listSessions("d91250a6-790a-43ce-9688-004d88e33d5a");
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
        setSessao(null);
        setLoadingSessao(false);
      });
  };

  return (
    <SessionContext.Provider
      value={{
        loadingSessao,
        loadingSessoesList,
        sessao,
        presentationList,
        sessoesList,
        setSessao,
        listSessions,
        listPresentations,
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
