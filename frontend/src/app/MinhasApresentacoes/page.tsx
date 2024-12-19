"use client";

import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { MinhasApresentacoesMock } from "@/mocks/MinhasApresentacoes";
import Listagem from "@/templates/Listagem/Listagem";
import { useRouter } from "next/navigation";

import "./style.scss";

export default function MinhasApresentacoes() {
  const { title, userArea, cardsMock } = MinhasApresentacoesMock;
  const router = useRouter();

  return (
    <ProtectedLayout>
      <div className="d-flex flex-column before-list">
        <Listagem
          title={title}
          labelAddButton={userArea.add}
          searchPlaceholder={userArea.search}
          cardsList={cardsMock}
          onAddButtonClick={() => router.push("/CadastroApresentacao")}
          isMyPresentation
        />
      </div>
    </ProtectedLayout>
  );
}
