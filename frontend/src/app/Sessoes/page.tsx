"use client";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { AuthProvider } from "@/context/AuthProvider/authProvider";
import { SessoesMock } from "@/mocks/Sessoes";
import Listagem from "@/templates/Listagem/Listagem";


export default function Sessoes() {
  const { title, userArea, cardsMock, buttonList } = SessoesMock;

  return (
    <AuthProvider>
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
            labelListCardsButton={buttonList}
            searchPlaceholder={userArea.search}
            cardsList={cardsMock}
          />
        </div>
      </ProtectedLayout>
    </AuthProvider>
  );
}
