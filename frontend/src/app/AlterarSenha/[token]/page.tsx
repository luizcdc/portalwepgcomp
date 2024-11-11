"use client";

import { FormAlterarSenha } from "@/components/Forms/AlterarSenha/FormAlterarSenha";
import "./style.scss";
import { useUsers } from "@/hooks/useUsers";
import LoadingPage from "@/components/LoadingPage";

export default function AlterarSenha({ params }) {
  const { loadingResetPassword } = useUsers();

  return (
    <div className="container d-flex flex-column flex-grow-1 text-black alterar-senha-tela">
      {loadingResetPassword && <LoadingPage />}
      {!loadingResetPassword && (
        <>
          <div className="container">
            <h1 className="d-flex justify-content-center mt-5 fw-normal">
              WEPGCOMP
              <span className="ms-2">2025</span>
            </h1>
            <hr />
            <h2 className="d-flex justify-content-center mb-4 fw-bold text-black">
              Alteração de Senha
            </h2>
          </div>
          <div className="container d-flex justify-content-center mb-5">
            <FormAlterarSenha params={params} />
          </div>
        </>
      )}
    </div>
  );
}
