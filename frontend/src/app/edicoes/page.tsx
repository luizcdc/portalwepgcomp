"use client";
import Listagem from "@/templates/Listagem/Listagem";
import { EventoMock } from "@/mocks/Evento";
import { useRouter } from "next/navigation";
import { useEdicao } from "@/hooks/useEdicao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";

export default function Edicoes() {
  const { title, userArea } = EventoMock;
  const { deleteEdicao, loadingEdicoesList, edicoesList } = useEdicao();
  const router = useRouter();

  console.log(edicoesList);
  const handleDelete = (id: string) => {
    console.log("Deletar edição com ID:", id);
    deleteEdicao(id);
  };

  const handleClickItem = (item: any) => {
    console.log("Edição selecionada:", item);
  };

  return (
    <ProtectedLayout>
      <div
        className='d-flex flex-column'
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
            cardsList={edicoesList.map((edicao) => ({
              id: edicao.id,
              title: edicao.name,
              subtitle: edicao.description,
            }))}
            onClickItem={handleClickItem}
            onDelete={handleDelete}
            onAddButtonClick={() => router.push("/CadastroEdicao")}
          />
        )}
      </div>
    </ProtectedLayout>
  );
}
