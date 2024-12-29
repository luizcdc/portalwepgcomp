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

  const {
    submissionList,
    getSubmissions,
    loadingSubmissionList,
    deleteSubmissionById,
  } = useSubmission();

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState<boolean>(true);


  useEffect(() => {
    const params = {
      eventEditionId: getEventEditionIdStorage() ?? "",
    };
    getSubmissions(params);
  }, [getSubmissions]);

  useEffect(() => {
    const filteredSessions = submissionList.filter((submission) => {
      if (user?.level === "Superadmin") {
        return submission.title.toLowerCase().includes(searchValue.trim().toLowerCase());
      }

      return submission.mainAuthorId === user?.id && submission.title.toLowerCase().includes(searchValue.trim().toLowerCase())
    });

    setSessionsListValues(filteredSessions);

    if (user?.level !== "Superadmin") {
      const hasOwnSubmission = filteredSessions.length > 0;
      setIsAddButtonDisabled(hasOwnSubmission);
    }
  }, [searchValue, submissionList, user]);

  useEffect(() => {
    const filteredSessions = submissionList.filter((v) =>
      v.title.toLowerCase().includes(searchValue.trim().toLowerCase())
    );
    setSessionsListValues(filteredSessions);
  }, [searchValue, submissionList]);

  const handleDelete = async (submissionId: string) => {
    if (user?.level === "Superadmin") {
      await deleteSubmissionById(submissionId);

      const updatedSubmissions = sessionsListValues.filter(
        submission => submission.id !== submissionId
      );

      setSessionsListValues(updatedSubmissions);
    } else {
      const submission = submissionList.find((submission) => submission.id === submissionId);

      if (submission?.mainAuthorId === user?.id) {
        await deleteSubmissionById(submissionId);

        const updatedSubmissions = sessionsListValues.filter(submission => submission.id !== submissionId);

        setSessionsListValues(updatedSubmissions);
      }
    }
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
