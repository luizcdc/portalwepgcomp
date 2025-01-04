"use client";
import Listagem from "@/templates/Listagem/Listagem";
import { EventoMock } from "@/mocks/Evento";
import { useRouter } from "next/navigation";
import { useEdicao } from "@/hooks/useEdicao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";

export default function Edicoes() {
  const { title, userArea, cardsMock } = EventoMock;
  const { deleteEdicao, loadingEdicoesList } = useEdicao();
  const router = useRouter();

  return (
    <ProtectedLayout>
      <div
        className="d-flex flex-column"
        style={{
          gap: "50px",
        }}
      >
        {loadingEdicoesList ? (
          <p>Carregando edições...</p>
        ) : (
          <Listagem
            title={title}
            labelAddButton={userArea.add}
            searchPlaceholder={userArea.search}
            cardsList={cardsMock}
            onDelete={(id: string) => deleteEdicao(id)}
            onAddButtonClick={() => router.push("/cadastro-edicao")}
          />
        )}
      </div>
    </ProtectedLayout>
  );
}
