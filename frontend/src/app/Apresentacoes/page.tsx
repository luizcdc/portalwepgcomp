"use client";

import { useEffect, useState } from "react";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { SubmissionProvider } from "@/context/submission";
import { SubmissionFileProvider } from "@/context/submissionFile";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Apresentacoes() {
  const { title, userArea, cardsMock } = ApresentacoesMock;

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] =
    useState<any[]>(cardsMock);

  useEffect(() => {
    const newSessionsList =
      cardsMock?.filter((v) => v.name?.includes(searchValue.trim())) ?? [];
    setSessionsListValues(newSessionsList);
  }, [searchValue]);

  return (
    <SubmissionFileProvider>
      <SubmissionProvider>
        <div className="d-flex flex-column before-list">
          <Listagem
            idModal="editarApresentacaoModal"
            title={title}
            labelAddButton={userArea.add}
            searchValue={searchValue}
            onChangeSearchValue={(value) => setSearchValue(value)}
            searchPlaceholder={userArea.search}
            cardsList={sessionsListValues}
          />
          <ModalEditarCadastro />
        </div>
      </SubmissionProvider>
    </SubmissionFileProvider>
  );
}
