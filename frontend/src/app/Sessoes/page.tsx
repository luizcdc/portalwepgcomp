"use client";

import { useEffect, useState } from "react";
import ModalSessao from "@/components/Modais/ModalSessao/ModalSessao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { useSession } from "@/hooks/useSession";
import { SessoesMock } from "@/mocks/Sessoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Sessoes() {
  const { title, userArea, buttonList, eventEditionId } = SessoesMock;
  const { listSessions, sessoesList } = useSession();

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] =
    useState<Sessao[]>(sessoesList);

  useEffect(() => {
    listSessions(eventEditionId);
  }, []);

  useEffect(() => {
    const newSessionsList =
      sessoesList?.filter((v) => v.title?.includes(searchValue.trim())) ?? [];
    setSessionsListValues(newSessionsList);
  }, [searchValue]);

  return (
    <ProtectedLayout>
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
        />
        <ModalSessao />
      </div>
    </ProtectedLayout>
  );
}
