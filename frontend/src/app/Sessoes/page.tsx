"use client";

import ModalSessao from "@/components/ModalSessao/ModalSessao";
import { SessoesMock } from "@/mocks/Sessoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Sessoes() {
  const { title, userArea, cardsMock, buttonList } = SessoesMock;

  return (
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
  );
}
