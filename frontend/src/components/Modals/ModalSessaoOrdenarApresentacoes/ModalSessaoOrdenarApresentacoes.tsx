"use client";

import FormSessaoOrdenarApresentacoes from "@/components/Forms/SessaoOrdenarApresentacoes/FormSessaoOrdenarApresentacoes";
import "./style.scss";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";
import { useSession } from "@/hooks/useSession";
import { useEffect, useState } from 'react';
import DraggableList from '@/components/DraggableList/DraggableList';
import { getEventEditionIdStorage } from '@/context/AuthProvider/util';

export default function ModalSessaoOrdenarApresentacoes() {
  const { swapPresentationsOnSession, sessao } = useSession();
  const [listaOrdenada, setListaOrdenada] = useState<any[]>([]);

  useEffect(() => {
    const listaOrdenadaSessao: any = sessao?.presentations
      ?.toSorted((a, b) => a.positionWithinBlock - b.positionWithinBlock)
      .map(p => p.submission);
    setListaOrdenada(listaOrdenadaSessao);
  }, [sessao]);

  const handleOnChangeOrder = async (data: any[], fromIndex: number, toIndex: number) => {
    const apresentacao1 = sessao?.presentations[fromIndex];
    const apresentacao2 = sessao?.presentations[toIndex];
    const eventEditionId = getEventEditionIdStorage();
    
    
    await swapPresentationsOnSession(sessao?.id || "", eventEditionId ?? "", {
      presentation1Id: apresentacao1?.id || "",
      presentation2Id: apresentacao2?.id || "",
    });

    setListaOrdenada(data);
  }

  return (
    <ModalComponent
      id={"trocarOrdemApresentacao"}
      loading={false}
      labelConfirmButton="Confirmar"
      idCloseModal="trocarOrdemApresentacaoClose"
    >
      <div className="m-4 mt-0">
        <h3 className="mb-4 fw-bold">Mudar ordenação das apresentações</h3>

        <div className="mt-4 mb-4">
          <p className="form-label fw-bold form-title">Arraste os itens para alterar a ordenação</p>
          <DraggableList 
            list={listaOrdenada}
            labelTitle="title"
            labelSubtitle="abstract"
            onChangeOrder={handleOnChangeOrder}
            />
        </div>
      </div>
    </ModalComponent>
  );
}
