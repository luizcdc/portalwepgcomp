"use client";
import { FormEdicao } from "@/components/Forms/CadastroEdicao/FormEdicao";
import "./style.scss";

export default function CadastroEdicao() {
  return (
    <div className="cadastro-edicao">
      <div className="title">
        <h1 className="d-flex justify-content-center mt-5 fw-normal">
          WEPGCOMP
          <span className="ms-2">2025</span>
        </h1>
        <hr />
      </div>
      <div className="sub-title">Cadastro de Edição</div>
      <FormEdicao />
    </div>
  );
}
