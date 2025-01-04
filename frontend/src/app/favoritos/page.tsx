"use client";

import PresentationModal from "@/components/Modals/ModalApresentação/PresentationModal";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { FavoritosMock } from "@/mocks/Favoritos";
import Listagem from "@/templates/Listagem/Listagem";
import Modal from "../../components/UI/Modal/Modal";
import { useEffect, useRef, useState } from "react";
import { usePresentation } from "@/hooks/usePresentation";

export default function Favoritos() {
  const { presentationBookmarks, getPresentationBookmarks } = usePresentation();
  const { title, userArea,  } = FavoritosMock;
  const openModal = useRef<HTMLButtonElement | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);

  useEffect(() => {
    getPresentationBookmarks()
  }, [])

  useEffect(() => {
    if (!presentationBookmarks?.bookmarkedPresentations?.length) {
      console.error("Nenhuma apresentação marcada encontrada");
      return;
    }
  
    const newSessionsList = presentationBookmarks.bookmarkedPresentations
      .filter((item) =>
        item.submission?.title?.toLowerCase().includes(searchValue.trim().toLowerCase())
      )
      .map((item) => item.submission);
  
    console.log("Filtered Submissions:", newSessionsList);
  
    setSessionsListValues(newSessionsList);
  }, [presentationBookmarks, searchValue]);
  


  console.log("SessioList: ",sessionsListValues)


  // TODO: Integrar com os modelos de apresentação
  const [modalContent, setModalContent] =
    useState<any>(sessionsListValues);

  function openModalPresentation(item) {
    setModalContent({ ...modalContent, ...item });
    openModal.current?.click();
  }



  console.log("presentatios: ", presentationBookmarks)

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
          cardsList={sessionsListValues.map((submission) => ({
            id: submission.id,
            title: submission.title,
            subtitle: submission.abstract,
          }))}
          isFavorites
          idModal={title.trim() + "-modal"}
          searchValue={searchValue}
          onChangeSearchValue={(value) => setSearchValue(value)}
          searchPlaceholder={userArea.search}
          onClickItem={(item) => openModalPresentation(item)}
        />
      </div>

      <Modal
        content={<PresentationModal props={modalContent} />}
        reference={openModal}
      />
    </ProtectedLayout>
  );
}
