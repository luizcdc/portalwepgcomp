"use client";

import ModalSessao from "@/components/Modais/ModalSessao/ModalSessao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { SessoesMock } from "@/mocks/Sessoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Sessoes() {
  const { title, userArea, cardsMock, buttonList } = SessoesMock;

  return (
    <ProtectedLayout>
      <div
        className="d-flex flex-column"
        style={{
          gap: "50px",
        }}
      >
        <Listagem
          idModal="sessaoModal"
          title={title}
          labelAddButton={userArea.add}
          labelListCardsButton={buttonList}
          searchPlaceholder={userArea.search}
          cardsList={cardsMock}
        />
        <ModalSessao />
      </div>
    </ProtectedLayout>
  );
}
