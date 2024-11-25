"use client";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem from "@/templates/Listagem/Listagem";
import { useEffect, useState } from "react";

export default function Apresentacoes() {
  const { title, userArea, cardsMock, buttonList } = ApresentacoesMock;

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] =
    useState<any[]>(cardsMock);

  useEffect(() => {
    const newSessionsList =
      cardsMock?.filter((v) => v.name?.includes(searchValue.trim())) ?? [];
    setSessionsListValues(newSessionsList);
  }, [searchValue]);

  return (
    <div
      className="d-flex flex-column"
      style={{
        gap: "50px",
      }}
    >
      <Listagem
        idModal="editarApresentacaoModal"
        title={title}
        labelAddButton={userArea.add}
        labelListCardsButton={buttonList}
        searchValue={searchValue}
        onChangeSearchValue={(value) => setSearchValue(value)}
        searchPlaceholder={userArea.search}
        cardsList={sessionsListValues}
      />
      <ModalEditarCadastro />
    </div>
  );
}
