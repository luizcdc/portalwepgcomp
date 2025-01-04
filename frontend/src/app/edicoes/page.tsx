"use client";
import Listagem from "@/templates/Listagem/Listagem";
import { useRouter } from "next/navigation";
import { useEdicao } from "@/hooks/useEdicao";
import { useEffect, useState } from "react";
import { edicaoApi } from "@/services/edicao";

export default function Edicoes() {
  const { deleteEdicao, loadingEdicoesList } = useEdicao();
  const router = useRouter();
  const [edicoes, setEdicoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEdicoes = async () => {
      try {
        const data = await edicaoApi.listEdicao();
        setEdicoes(data);
      } catch (error) {
        console.error("Erro ao carregar as edições:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEdicoes();
  }, []);

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
          cardsList={edicoes}
          onDelete={(id: string) => deleteEdicao(id)}
          onAddButtonClick={() => router.push("/cadastro-edicao")}
        />
      )}
    </div>
  );
}
