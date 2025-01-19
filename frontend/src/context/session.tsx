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
  sessao: Sessao | null;
  roomsList: Room[];
  loadingRoomsList: boolean;
  setSessao: Dispatch<SetStateAction<Sessao | null>>;
  listSessions: (eventEditionId: string) => void;
  listRooms: (eventEditionId: string) => void;
  getSessionById: (idSession: string) => void;
  createSession: (
    eventEditionId: string,
    body: SessaoParams
  ) => Promise<boolean>;
  updateSession: (
    idSession: string,
    eventEditionId: string,
    body: SessaoParams
  ) => Promise<boolean>;
  deleteSession: (idSession: string, eventEditionId: string) => void;
  swapPresentationsOnSession: (
    idSession: string,
    eventEditionId: string,
    bodies: SwapPresentationsOnSession[]
  ) => Promise<boolean>;
}

export const SessionContext = createContext<SessionProviderData>(
  {} as SessionProviderData
);

export const SessionProvider = ({ children }: SessionProps) => {
  const [loadingSessoesList, setLoadingSessoesList] = useState<boolean>(false);
  const [loadingSessao, setLoadingSessao] = useState<boolean>(false);
  const [sessoesList, setSessoesList] = useState<Sessao[]>([]);
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [loadingRoomsList, setLoadingRoomsList] = useState<boolean>(false);
  const [roomsList, setRoomsList] = useState<Room[]>([]);

  const { showAlert } = useSweetAlert();

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

  const listRooms = async (eventEditionId: string) => {
    setLoadingRoomsList(true);
    sessionApi
      .listRooms(eventEditionId)
      .then((response) => {
        setRoomsList(response);
      })
      .catch((err) => {
        console.log(err);
        setRoomsList([]);
      })
      .finally(() => {
        setLoadingRoomsList(false);
      });
  };

  const getSessionById = async (idSession: string) => {
    setLoadingSessao(true);
    sessionApi
      .getSessionById(idSession)
      .then((response) => {
        setSessao(response);
      })
      .catch((err) => {
        console.log(err);
        setSessao(null);
      })
      .finally(() => {
        setLoadingSessao(false);
      });
  };

  const createSession = async (eventEditionId: string, body: SessaoParams) => {
    setLoadingSessao(true);

    return sessionApi
      .createSession(body)
      .then((response) => {
        setSessao(response);
        showAlert({
          icon: "success",
          title: "Cadastro de sessão realizado com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        const modalElementButton = document.getElementById(
          "sessaoModalClose"
        ) as HTMLButtonElement;

        if (modalElementButton) {
          modalElementButton.click();
        }

        listSessions(eventEditionId);
        return true;
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao cadastrar sessão",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
        return false;
      })
      .finally(() => {
        setLoadingSessao(false);
      });
  };

  const updateSession = async (
    idSession: string,
    eventEditionId: string,
    body: SessaoParams
  ) => {
    setLoadingSessao(true);
    return sessionApi
      .updateSessionById(idSession, body)
      .then((response) => {
        setSessao(response);
        showAlert({
          icon: "success",
          title: "Atualização de sessão realizada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        const modalElementButton = document.getElementById(
          "sessaoModalClose"
        ) as HTMLButtonElement;

        if (modalElementButton) {
          modalElementButton.click();
        }
        listSessions(eventEditionId);
        return true;
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao atualizar sessão",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
        return false;
      })
      .finally(() => {
        setLoadingSessao(false);
      });
  };

  const deleteSession = async (idSession: string, eventEditionId: string) => {
    setLoadingSessao(true);
    sessionApi
      .deleteSessionById(idSession)
      .then(() => {
        showAlert({
          icon: "success",
          title: "Sessão deletada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });

        listSessions(eventEditionId);

        return true;
      })
      .catch((err) => {
        showAlert({
          icon: "error",
          title: "Erro ao deletar sessão",
          text:
            err.response?.data?.message?.message ||
            err.response?.data?.message ||
            "Ocorreu um erro durante a deleção. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });
        return false;
      })
      .finally(() => {
        setSessao(null);
        setLoadingSessao(false);
      });
  };

  const swapPresentationsOnSession = async (
    idSession: string,
    eventEditionId: string,
    presentations: SwapPresentationsOnSession[]
  ) => {
    setLoadingSessao(true);
    const body = { presentations };
    return sessionApi.swapPresentationsOnSession(idSession, body).then(() => {
        showAlert({
          icon: "success",
          title:
            "Troca na ordem das apresentações da sessão realizada com sucesso!",
          timer: 3000,
          showConfirmButton: false,
        });
        listSessions(eventEditionId);

        return true;
      })
      .catch((errors) => {
        showAlert({
          icon: "error",
          title: "Erro na troca da ordem das apresentações da sessão",
          text: "Ocorreu um erro durante a troca. Tente novamente mais tarde!",
          confirmButtonText: "Retornar",
        });

        return false;
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
        setSessao,
        sessoesList,
        listSessions,
        listRooms,
        roomsList,
        loadingRoomsList,
        getSessionById,
        createSession,
        updateSession,
        deleteSession,
        swapPresentationsOnSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
