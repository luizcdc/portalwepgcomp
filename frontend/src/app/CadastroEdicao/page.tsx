"use client";
import { FormEdicao } from "@/components/Forms/CadastroEdicao/FormEdicao";

export default function CadastroEdicao() {
  return (
    <div>
      <h1 className='d-flex justify-content-center mt-5 fw-normal text-primary'>
        WEPGCOMP
      </h1>
      <hr className='linha' />

      <div className='d-flex justify-content-center fw-bold'>
        Cadastro de Edição
      </div>
      <FormEdicao />
    </div>
  );
}
