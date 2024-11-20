"use client";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { MinhasApresentacoesMock } from "@/mocks/MinhasApresentacoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function MinhasApresentacoes() {
  const { title, userArea, cardsMock } = MinhasApresentacoesMock;

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
          labelAddButton={userArea.add}
          labelListCardsButton={""}
          searchPlaceholder={userArea.search}
          cardsList={cardsMock}
        />
      </div>
    </ProtectedLayout>
  );
}
