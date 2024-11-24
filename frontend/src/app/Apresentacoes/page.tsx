"use client";

import ModalCadastroApresentacao from "@/components/Modals/ModalCadastroApresentacao/ModalCadastroApresentacao";
import { ApresentacoesMock } from "@/mocks/Apresentacoes";
import Listagem from "@/templates/Listagem/Listagem";

export default function Apresentacoes() {
  const { title, userArea, cardsMock, buttonList } = ApresentacoesMock;

  return (
    <div
      className='d-flex flex-column'
      style={{
        gap: "50px",
      }}
    >
      <Listagem
        idModal='apresentacaoModal'
        title={title}
        labelAddButton={userArea.add}
        labelListCardsButton={buttonList}
        searchPlaceholder={userArea.search}
        cardsList={cardsMock}
      />
    </div>
  );
}
