"use client";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { SessoesMock } from "@/mocks/Sessoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Sessoes() {
  const { title, userArea, cardsMock, buttonList } = SessoesMock;

  return (
    <ProtectedLayout>
      <div
        className='d-flex flex-column'
        style={{
          gap: "50px",
        }}
      >
        <Listagem
          title={title}
          labelAddButton={userArea.add}
          navigate='#'
          labelListCardsButton={buttonList}
          searchPlaceholder={userArea.search}
          cardsList={cardsMock}
        />
      </div>
    </ProtectedLayout>
  );
}
