"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { useUsers } from "@/hooks/useUsers";

import { AuthContext } from "@/context/AuthProvider/authProvider";
import { SubmissionProvider } from "@/context/submission";
import { SubmissionFileProvider } from "@/context/submissionFile";

import { FormCadastroApresentacao } from "@/components/Forms/CadastroApresentacao/FormCadastroApresentacao";
import LoadingPage from "@/components/LoadingPage";
import ModalCadastroApresentacao from "@/components/Modals/ModalCadastroApresentacao/ModalCadastroApresentacao";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";

import "./style.scss";

export default function CadastroApresentacao() {
  const { loadingCreateUser } = useUsers();
  const { user } = useContext(AuthContext);
  const { showAlert } = useSweetAlert();
  const router = useRouter();

  useEffect(() => {
    if (user?.profile !== "DoctoralStudent") {
      showAlert({
        icon: "error",
        title: "Acesso não autorizado",
        text: "Você não tem permissão para acessar esta página.",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/");
      });
    }
  }, [])

  return (
    <ProtectedLayout>
      <SubmissionFileProvider>
        <SubmissionProvider>
          <div className="container d-flex flex-column flex-grow-1 text-black pageApresentacao">
            {loadingCreateUser && <LoadingPage />}
            {!loadingCreateUser && user?.profile === "DoctoralStudent" && (
              <>
                <div className="container">
                  <h1 className="d-flex justify-content-center mt-5 fw-normal">
                    WEPGCOMP
                    <span className="ms-2">2025</span>
                  </h1>
                  <hr />
                </div>
                <div className="container d-flex justify-content-center mb-5">
                  <FormCadastroApresentacao />
                </div>
              </>
            )}
            <ModalCadastroApresentacao />
          </div>
        </SubmissionProvider>
      </SubmissionFileProvider>
    </ProtectedLayout>
  );
}
