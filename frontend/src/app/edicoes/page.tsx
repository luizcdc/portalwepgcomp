"use client";
import { useEffect, useState } from "react";
import Listagem from "@/templates/Listagem/Listagem";
import { EventoMock } from "@/mocks/Evento";
import { useRouter } from "next/navigation";
import { useEdicao } from "@/hooks/useEdicao";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";

export default function Edicoes() {
  const { title, userArea } = EventoMock;
  const { deleteEdicao, loadingEdicoesList, edicoesList, getEdicaoById } =
    useEdicao();
  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<Edicao[]>([]);
  const router = useRouter();

  const handleDelete = async (edicaoId: string) => {
    await deleteEdicao(edicaoId);
    const updatedEdicao = edicoesList.filter(
      (edicao) => edicao.id !== edicaoId
    );

    setSessionsListValues(updatedEdicao);
  };

  useEffect(() => {
    if (edicoesList.length > 0) {
      setSessionsListValues(edicoesList);
      console.log(edicoesList);
    }
  }, [edicoesList]);

  useEffect(() => {
    const eventEditionId = getEventEditionIdStorage() ?? "";

    getEdicaoById(eventEditionId);
  }, []);

  useEffect(() => {
    const filteredSessions = edicoesList.filter((v) =>
      v.name.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
    setSessionsListValues(filteredSessions);
    console.log(filteredSessions);
  }, [searchValue, edicoesList]);

  return (
    <div
      className='d-flex flex-column'
      style={{
        gap: "50px",
      }}
    >
      {loadingEdicoesList ? (
        <p>Carregando edições...</p>
      ) : (
        <Listagem
          title={title}
          labelAddButton={userArea.add}
          searchPlaceholder={userArea.search}
          searchValue={searchValue}
          onChangeSearchValue={(value) => setSearchValue(value)}
          cardsList={sessionsListValues}
          onDelete={handleDelete}
          onAddButtonClick={() => router.push("/cadastro-edicao")}
        />
      )}
    </div>
  );
}
