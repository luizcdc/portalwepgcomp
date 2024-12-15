"use client";
import { EventoMock } from "@/mocks/Evento";
import Listagem from "@/templates/Listagem/Listagem";
import { useRouter } from "next/navigation";
import { useEdicao } from "@/hooks/useEdicao";

export default function Edicoes() {
  const { title, userArea, cardsMock, buttonList } = EventoMock;
  const { deleteEdicao } = useEdicao();
  const router = useRouter();
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
        searchPlaceholder={userArea.search}
        cardsList={cardsMock}
        onDelete={(id: string) => deleteEdicao(id)}
        onAddButtonClick={() => router.push("/CadastroEdicao")}
      />
    </div>
  );
}
