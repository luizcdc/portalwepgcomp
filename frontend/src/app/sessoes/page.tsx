"use client";

import { useEffect, useState } from "react";

import ModalSessao from "@/components/Modals/ModalSessao/ModalSessao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { useSession } from "@/hooks/useSession";
import { SessoesMock } from "@/mocks/Sessoes";
import Listagem from "@/templates/Listagem/Listagem";
import ModalSessaoOrdenarApresentacoes from "@/components/Modals/ModalSessaoOrdenarApresentacoes/ModalSessaoOrdenarApresentacoes";
import { useUsers } from "@/hooks/useUsers";
import { useEdicao } from "@/hooks/useEdicao";
import { useSubmission } from "@/hooks/useSubmission";

export default function Sessoes() {
  const { title, userArea } = SessoesMock;
  const { listSessions, sessoesList, deleteSession, setSessao } = useSession();
  const { getUsers } = useUsers();
  const { getSubmissions } = useSubmission();
  const { Edicao } = useEdicao();

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] =
    useState<Sessao[]>(sessoesList);

  const getSessionOnList = (card: any) => {
    const sessaoValue = sessoesList?.find((v) => v.id === card.id);

    if (sessaoValue?.id) {
      setSessao(sessaoValue);
    }
  };

  useEffect(() => {
    listSessions(Edicao?.id ?? "");
    getUsers({ profile: "Professor" });
    getSubmissions({
      eventEditionId: Edicao?.id ?? "",
      withouPresentation: true,
    });
  }, []);

  useEffect(() => {
    if (sessoesList.length) {
      const newSessionsList =
        sessoesList?.filter(
          (v) => !v.title || v.title?.includes(searchValue.trim())
        ) ?? [];
      setSessionsListValues(newSessionsList);
    }
  }, [sessoesList, searchValue]);

  useEffect(() => {
    setSessionsListValues(sessoesList);
  }, []);

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
          searchPlaceholder={userArea.search}
          searchValue={searchValue}
          onChangeSearchValue={(value) => setSearchValue(value)}
          cardsList={sessionsListValues}
          idGeneralModal="trocarOrdemApresentacao"
          generalButtonLabel="Trocar ordem das apresentações"
          onClickItem={getSessionOnList}
          onClear={() => setSessao(null)}
          onDelete={(id: string) => deleteSession(id, Edicao?.id ?? "")}
        />
        <ModalSessao />
        <ModalSessaoOrdenarApresentacoes />
      </div>
    </ProtectedLayout>
  );
}
