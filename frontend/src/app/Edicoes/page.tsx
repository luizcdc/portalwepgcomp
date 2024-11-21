"use client";

import { EventoMock } from "@/mocks/Evento";
import Listagem from "@/templates/Listagem/Listagem";

export default function Edicoes() {
  const { title, userArea, cardsMock, buttonList } = EventoMock;

  return (
    <div
      className='d-flex flex-column'
      style={{
        gap: "50px",
      }}
    >
      <Listagem
        title={title}
        labelAddButton={userArea.add}
        navigate='/CadastroEdicao'
        labelListCardsButton={buttonList}
        searchPlaceholder={userArea.search}
        cardsList={cardsMock}
      />
    </div>
  );
}
