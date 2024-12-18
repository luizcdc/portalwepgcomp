"use client";

import { useEffect, useState } from "react";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { getEventEditionIdStorage } from '@/context/AuthProvider/util';
import { SubmissionProvider } from "@/context/submission";
import { SubmissionFileProvider } from "@/context/submissionFile";
import { useAuth } from "@/hooks/useAuth";
import { useSubmission } from "@/hooks/useSubmission";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Apresentacoes() {
  const { title, userArea } = ApresentacoesMock;
  const { user } = useAuth();

  const eventEditionId = getEventEditionIdStorage();
  const userId = user?.id;

  const {
    submissionList,
    getSubmissions,
    loadingSubmissionList,
    deleteSubmissionById,
  } = useSubmission();

  const [searchValue, setSearchValue] = useState<string>("");
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true);
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);


  useEffect(() => {
    const params = {
      eventEditionId: eventEditionId ?? "",
    };
    getSubmissions(params);
  }, [eventEditionId, getSubmissions]);

  useEffect(() => {
    if (userId) {
      const hasSubmission = submissionList.some(
        (submission) => submission.mainAuthorId === user.id && submission.eventEditionId === eventEditionId
      );
      setIsAddButtonDisabled(hasSubmission);
    }
  }, [user, userId, submissionList, eventEditionId]);

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
            isAddButtonDisabled={isAddButtonDisabled}
          />
          <ModalEditarCadastro />
        </div>
      </SubmissionProvider>
    </SubmissionFileProvider>
  );
}
