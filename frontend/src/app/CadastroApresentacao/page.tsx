"use client";

import { FormCadastroApresentacao } from "@/components/Forms/CadastroApresentacao/FormCadastroApresentacao";
import LoadingPage from "@/components/LoadingPage";
import ModalCadastroApresentacao from "@/components/Modals/ModalCadastroApresentacao/ModalCadastroApresentacao";
import { SubmissionProvider } from "@/context/submission";
import { SubmissionFileProvider } from "@/context/submissionFile";
import { useUsers } from "@/hooks/useUsers";

import "./style.scss";

export default function CadastroApresentacao() {
  const { loadingCreateUser } = useUsers();

  return (
    <SubmissionFileProvider>
      <SubmissionProvider>
        <div className='container d-flex flex-column flex-grow-1 text-black pageApresentacao'>
          {loadingCreateUser && <LoadingPage />}
          {!loadingCreateUser && (
            <>
              <div className='container'>
                <h1 className='d-flex justify-content-center mt-5 fw-normal'>
                  WEPGCOMP
                  <span className='ms-2'>2025</span>
                </h1>
                <hr />
                <h2 className='d-flex justify-content-center mb-4 fw-bold text-black'>
                  Cadastro de Apresentação
                </h2>
                <br />
              </div>
              <div className='container d-flex justify-content-center mb-5'>
                <FormCadastroApresentacao />
              </div>
            </>
          )}
          <ModalCadastroApresentacao />
        </div>
      </SubmissionProvider>
    </SubmissionFileProvider>
  );
}
