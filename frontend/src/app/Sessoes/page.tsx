"use client";

import { useEffect, useState } from "react";

import ModalSessao from "@/components/Modals/ModalSessao/ModalSessao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { useSession } from "@/hooks/useSession";
import { SessoesMock } from "@/mocks/Sessoes";
import Listagem from "@/templates/Listagem/Listagem";
import ModalSessaoOrdenarApresentacoes from "@/components/Modals/ModalSessaoOrdenarApresentacoes/ModalSessaoOrdenarApresentacoes";

export default function Sessoes() {
  const { title, userArea, buttonList, eventEditionId } = SessoesMock;
  const { listSessions, sessoesList, deleteSession, setSessao } = useSession();

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] =
    useState<Sessao[]>(sessoesList);

  const getSessionOnList = (card: any) => {
    const sessaoValue = sessoesList.find((v) => v.id === card.id);

    if (sessaoValue?.id) {
      setSessao(sessaoValue);
    }
  };

  useEffect(() => {
    listSessions(eventEditionId);
  }, []);

  useEffect(() => {
    const newSessionsList =
      sessoesList?.filter((v) => v.title?.includes(searchValue.trim())) ?? [];
    setSessionsListValues(newSessionsList);
  }, [searchValue, sessoesList]);

  return (
    // <ProtectedLayout>
    <div
      className="d-flex flex-column"
      style={{
        gap: "50px",
      }}
    >
      <Listagem
        idModal="sessaoModal"
        title={title}
        labelAddButton={userArea.add}
        labelListCardsButton={buttonList}
        searchPlaceholder={userArea.search}
        searchValue={searchValue}
        onChangeSearchValue={(value) => setSearchValue(value)}
        cardsList={sessionsListValues}
        idGeneralModal="trocarOrdemApresentacao"
        generalButtonLabel="Trocar ordem das apresentações"
        onClickItem={getSessionOnList}
        onClear={() => setSessao(null)}
        onDelete={(id: string) => deleteSession(id)}
      />
      <ModalSessao />
      <ModalSessaoOrdenarApresentacoes />
    </div>
    // </ProtectedLayout>
  );
}
