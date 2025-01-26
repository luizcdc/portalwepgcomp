"use client";

import { useEffect, useState } from "react";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { useAuth } from "@/hooks/useAuth";
import { useSubmission } from "@/hooks/useSubmission";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem, { mapCardList } from "@/templates/Listagem/Listagem";

export default function Apresentacoes() {
  const { title, userArea } = ApresentacoesMock;
  const { user } = useAuth();

  const {
    submissionList,
    getSubmissions,
    loadingSubmissionList,
    deleteSubmissionById,
    setSubmission,
  } = useSubmission();

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] =
    useState<boolean>(false);

  const getSubmissionOnList = (card: any) => {
    const submission = submissionList?.find((v) => v.id === card.id);

    if (submission?.id) {
      setSubmission(submission);
    }
  };

  useEffect(() => {
    const params = {
      eventEditionId: getEventEditionIdStorage() ?? "",
    };
    getSubmissions(params);
  }, []);

  useEffect(() => {
    const filteredSessions = submissionList.filter((submission) => {
      const searchMatch = submission.title
        .toLowerCase()
        .includes(searchValue.trim().toLowerCase());

      if (user?.level !== "Default") {
        return searchMatch;
      }

      return submission.mainAuthorId === user?.id && searchMatch;
    });

    setSessionsListValues(filteredSessions);

    if (user?.level === "Default") {
      const hasOwnSubmission = filteredSessions.length > 0;

      setIsAddButtonDisabled(hasOwnSubmission);
    }
  }, [searchValue, submissionList, user]);

  const handleDelete = async (submissionId: string) => {
    if (user?.level !== "Default") {
      await deleteSubmissionById(submissionId);

      const updatedSubmissions = sessionsListValues.filter(
        (submission) => submission.id !== submissionId
      );

      setSessionsListValues(updatedSubmissions);
    } else {
      const submission = submissionList.find(
        (submission) => submission.id === submissionId
      );

      if (submission?.mainAuthorId === user?.id) {
        await deleteSubmissionById(submissionId);

        const updatedSubmissions = sessionsListValues.filter(
          (submission) => submission.id !== submissionId
        );

        setSessionsListValues(updatedSubmissions);
      }
    }
  };

  const handleEdit = async (submissionId: string) => {
    const submission = sessionsListValues.find((s) => s.id === submissionId);
    setSubmission(submission);
  };

  return (
    <ProtectedLayout>
      <div className="d-flex flex-column before-list">
        <Listagem
          idModal="editarApresentacaoModal"
          title={title}
          labelAddButton={userArea.add}
          searchValue={searchValue}
          onChangeSearchValue={(value) => setSearchValue(value)}
          searchPlaceholder={userArea.search}
          cardsList={mapCardList(sessionsListValues, "title", "abstract")}
          isLoading={loadingSubmissionList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClickItem={getSubmissionOnList}
          onClear={() => setSubmission(null)}
          isAddButtonDisabled={isAddButtonDisabled}
        />
        <ModalEditarCadastro />
      </div>
    </ProtectedLayout>
  );
}
