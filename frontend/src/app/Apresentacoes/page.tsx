"use client";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
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
        idModal='editarCadastroModal'
        title={title}
        labelAddButton={userArea.add}
        labelListCardsButton={buttonList}
        searchPlaceholder={userArea.search}
        cardsList={cardsMock}
      />
      <ModalEditarCadastro />
    </div>
  );
}
