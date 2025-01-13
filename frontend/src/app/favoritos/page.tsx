"use client";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { FavoritosMock } from "@/mocks/Favoritos";
import Listagem from "@/templates/Listagem/Listagem";
import { useEffect, useRef, useState } from "react";
import { usePresentation } from "@/hooks/usePresentation";

export default function Favoritos() {
  const { presentationBookmarks, getPresentationBookmarks, deletePresentationBookmark } = usePresentation();
  const { title, userArea } = FavoritosMock;
  const openModal = useRef<HTMLButtonElement | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);

  useEffect(() => {
    getPresentationBookmarks()
  }, [])

  useEffect(() => {
    if (!presentationBookmarks?.bookmarkedPresentations?.length) {
      return;
    }  
    const newSessionsList = presentationBookmarks.bookmarkedPresentations
      .filter((item) =>
        item.submission?.title?.toLowerCase().includes(searchValue.trim().toLowerCase()));

    setSessionsListValues(newSessionsList); 
  }, [presentationBookmarks, searchValue]);



  const [modalContent, setModalContent] =
    useState<any>(sessionsListValues);

  function openModalPresentation(item) {
    setModalContent({ ...modalContent, ...item });
    openModal.current?.click();
  }


  const handleDelete = async (submissionId: any) => {
    await deletePresentationBookmark(submissionId);

    const updatedSubmissions = sessionsListValues.filter(
      (submission) => submission.id !== submissionId
    );
    setSessionsListValues(updatedSubmissions);
  };

  return (
    <ProtectedLayout>
      <div
        className="d-flex flex-column"
        style={{
          gap: "50px",
        }}
      >
        <Listagem        
          title={title}
          cardsList={sessionsListValues.map((presentation) => ({
            id: presentation?.submission.id,
            title: presentation?.submission.title,
            name: presentation?.submission.mainAuthor.name,
            email: presentation?.submission.mainAuthor.email,
            subtitle: presentation?.submission.abstract,
            pdfFile: presentation?.submission.pdfFile,
            advisorName: presentation?.submission?.advisor?.name,
            ...presentation,

          }))}
          isFavorites
          idModal={title.trim() + "-modal"}
          searchValue={searchValue}
          onChangeSearchValue={(value) => setSearchValue(value)}
          searchPlaceholder={userArea.search}
          onClickItem={(item) => openModalPresentation(item)}
          onDelete={handleDelete}
          fullInfo={true}
        />
      </div>
    </ProtectedLayout>
  );
}
