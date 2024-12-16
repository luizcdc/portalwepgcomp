"use client";

import { useEffect, useState } from "react";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { SubmissionProvider } from "@/context/submission";
import { SubmissionFileProvider } from "@/context/submissionFile";
import { useSubmission } from "@/hooks/useSubmission";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Apresentacoes() {
  const { title, userArea } = ApresentacoesMock;

  const [searchValue, setSearchValue] = useState<string>("");

  const {
    submissionList,
    getSubmissions,
    loadingSubmissionList,
  } = useSubmission();

  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);

  useEffect(() => {
    const params = {
      eventEditionId: "d91250a6-790a-43ce-9688-004d88e33d5a",
    };
    getSubmissions(params);
  }, [getSubmissions]);

  useEffect(() => {
    const filteredSessions = submissionList.filter((v) =>
      v.title.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
    setSessionsListValues(filteredSessions);
  }, [searchValue, submissionList]);

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
            cardsList={sessionsListValues.map((submission) => ({
              title: submission.title,
              subtitle: submission.abstract,
            }))}
            isLoading={loadingSubmissionList} 
          />
          <ModalEditarCadastro />
        </div>
      </SubmissionProvider>
    </SubmissionFileProvider>
  );
}
