"use client";
import { FormEdicao } from "@/components/Forms/CadastroEdicao/FormEdicao";
import { useEdicao } from "@/hooks/useEdicao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import "./style.scss";

export default function CadastroEdicao() {
  const { Edicao } = useEdicao();
  return (
    <ProtectedLayout>
      <div className='cadastro-edicao'>
        <div className='title'>
          <h1 className='d-flex justify-content-center mt-5 fw-normal ms-2'>
            {Edicao?.name || "Carregando..."}
          </h1>
          <hr />
        </div>
        <div className='sub-title'>Cadastro de Edição</div>
        <FormEdicao />
      </div>
    </ProtectedLayout>
  );
}
