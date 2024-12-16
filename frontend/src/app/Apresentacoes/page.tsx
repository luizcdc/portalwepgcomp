"use client";

import { useEffect, useState } from "react";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { SubmissionProvider } from "@/context/submission";
import { SubmissionFileProvider } from "@/context/submissionFile";
import { useSubmission } from "@/hooks/useSubmission";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem from "@/templates/Listagem/Listagem";
import { useEdicao } from "@/hooks/useEdicao";

export default function Apresentacoes() {
  const { title, userArea } = ApresentacoesMock;

  const [searchValue, setSearchValue] = useState<string>("");

  const { Edicao } = useEdicao();

  const {
    submissionList,
    getSubmissions,
    loadingSubmissionList,
    deleteSubmissionById,
  } = useSubmission();

  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);

  useEffect(() => {
    const params = {
      eventEditionId: Edicao?.id ?? "",
    };
    getSubmissions(params);
  }, [getSubmissions]);

  useEffect(() => {
    const filteredSessions = submissionList.filter((v) =>
      v.title.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
    setSessionsListValues(filteredSessions);
  }, [searchValue, submissionList]);

  const handleDelete = async (submissionId: string) => {
    await deleteSubmissionById(submissionId);

    const updatedSubmissions = submissionList.filter(
      (submission) => submission.id !== submissionId
    );

    setSessionsListValues(updatedSubmissions);
  };

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
              id: submission.id,
              title: submission.title,
              subtitle: submission.abstract,
            }))}
            isLoading={loadingSubmissionList}
            onDelete={handleDelete}
          />
          <ModalEditarCadastro />
        </div>
      </SubmissionProvider>
    </SubmissionFileProvider>
  );
}
