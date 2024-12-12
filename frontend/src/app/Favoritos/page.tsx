"use client";

import PresentationModal from "@/components/Modals/ModalApresentação/PresentationModal";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { FavoritosMock } from "@/mocks/Favoritos";
import { MockupPresentention } from "@/mocks/Schedule";
import Listagem from "@/templates/Listagem/Listagem";
import Modal from "../../components/UI/Modal/Modal";
import { useEffect, useRef, useState } from "react";

export default function Favoritos() {
  const { title, userArea, cardsMock } = FavoritosMock;
  const openModal = useRef<HTMLButtonElement | null>(null);

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] =
    useState<any[]>(cardsMock);

  useEffect(() => {
    const newSessionsList =
      cardsMock?.filter((v) => v.name?.includes(searchValue.trim())) ?? [];
    setSessionsListValues(newSessionsList);
  }, [searchValue]);

  const [modalContent, setModalContent] =
    useState<PresentationData>(MockupPresentention);

  function openModalPresentation(item) {
    setModalContent({ ...modalContent, ...item });
    openModal.current?.click();
  }

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
          cardsList={sessionsListValues}
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
