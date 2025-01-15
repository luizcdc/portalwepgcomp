"use client";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { FavoritosMock } from "@/mocks/Favoritos";
import Listagem from "@/templates/Listagem/Listagem";
import { useEffect, useState } from "react";
import { usePresentation } from "@/hooks/usePresentation";

export default function Favoritos() {
  const { presentationBookmarks, getPresentationBookmarks, deletePresentationBookmark } = usePresentation();
  const { title, userArea } = FavoritosMock;

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

  function favoriteItem(item) {
    setSessionsListValues({ ...sessionsListValues, ...item });
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
          onDelete={handleDelete}
          onEdit={(item) => favoriteItem(item)}
          fullInfo={true}
        />
      </div>
    </ProtectedLayout>
  );
}
