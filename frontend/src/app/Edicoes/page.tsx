"use client";
import { EventoMock } from "@/mocks/Evento";
import Listagem from "@/templates/Listagem/Listagem";
import { useRouter } from "next/navigation";

export default function Edicoes() {
  const { title, userArea, cardsMock, buttonList } = EventoMock;
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
        labelListCardsButton={buttonList}
        searchPlaceholder={userArea.search}
        cardsList={cardsMock}
        onAddButtonClick={() => router.push("/CadastroEdicao")}
      />
    </div>
  );
}
