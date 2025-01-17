"use client";
import { useEffect, useState } from "react";
import Listagem, { mapCardList } from "@/templates/Listagem/Listagem";
import { useRouter } from "next/navigation";
import { useEdicao } from "@/hooks/useEdicao";
import { edicaoApi } from "@/services/edicao";
import ModalEditarEdicao from "@/components/Modals/ModalEditarEdicao/Modal EditarEdição";

export default function Edicoes() {
  const { deleteEdicao, loadingEdicoesList } = useEdicao();
  const router = useRouter();
  const [edicoes, setEdicoes] = useState<Edicao[]>([]);
  const [edicaoSelecionada, setEdicaoSelecionada] = useState<Edicao | null>(
    null
  );

  useEffect(() => {
    const fetchEdicoes = async () => {
      try {
        const data = await edicaoApi.listEdicao();
        setEdicoes(data);
      } catch (error) {
        console.error("Erro ao carregar as edições:", error);
      }
    };

    fetchEdicoes();
  }, []);

  const handleEditClick = (edicaoId: string) => {
    const edicao = edicoes?.find((e) => e.id === edicaoId);

    if (edicao) {
      setEdicaoSelecionada(edicao);
    }
  };

  const handleDeleteEdicao = async (edicaoId: string) => {
    const status = await deleteEdicao(edicaoId);

    if (status) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }

  return (
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
          title={"Edições do Evento"}
          labelAddButton={"Cadastrar Edição"}
          searchPlaceholder={"Pesquise por edição"}
          cardsList={mapCardList(edicoes, "name", "description")}
          onEdit={handleEditClick}
          onDelete={(id: string) => handleDeleteEdicao(id)}
          onAddButtonClick={() => router.push("/cadastro-edicao")}
        />
      )}

      <ModalEditarEdicao edicaoData={edicaoSelecionada} />
    </div>
  );
}
