"use client";

import { FormCadastro } from "@/components/Forms/Cadastro/FormCadastro";
import "./style.scss";
import { useUsers } from "@/hooks/useUsers";
import LoadingPage from "@/components/LoadingPage";

export default function Cadastro() {
  const { loadingCreateUser } = useUsers();

  return (
    <div className="container d-flex flex-column flex-grow-1 text-black cadastro">
      {loadingCreateUser && <LoadingPage />}
      {!loadingCreateUser && (
        <>
          <div className="container">
            <h1 className="d-flex justify-content-center mt-5 fw-normal">
              WEPGCOMP
              <span className="ms-2">2025</span>
            </h1>
            <hr />
            <h2 className="d-flex justify-content-center mb-4 fw-bold text-black">
              Cadastro
            </h2>
          </div>
          <div className="container d-flex justify-content-center mb-5">
            <FormCadastro />
          </div>
        </>
      )}
    </div>
  );
}
