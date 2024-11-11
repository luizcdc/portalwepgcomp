"use client";

import { useState } from "react";
import "./style.scss";
import { useUsers } from "@/hooks/useUsers";
import LoadingPage from "../LoadingPage";

export default function ModalAlterarSenha() {
  const [email, setEmail] = useState<string>("");

  const { resetPasswordSendEmail, loadingSendEmail } = useUsers();

  const handleSendEmail = () => {
    if (!email) {
      throw new Error("Campos obrigatórios em branco.");
    } else {
      const body = {
        email,
      };

      resetPasswordSendEmail(body);
    }
  };

  return (
    <div
      className="modal fade modal-lg modal-alterar-senha"
      id="alterarSenhaModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {loadingSendEmail && <LoadingPage />}
          {!loadingSendEmail && (
            <>
              <div className="modal-header header-alterar-senha">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body content-alterar-senha">
                <h1 className="d-flex justify-content-center mt-5 fw-normal title-alterar-senha">
                  WEPGCOMP
                  <span className="ms-2">2025</span>
                </h1>

                <hr className="linha-alterar-senha" />

                <div className="content-alterar-senha">
                  <h2>Esqueci minha Senha</h2>
                  <p>
                    Por favor, informe o e-mail cadastrado em sua conta, e
                    enviaremos um link com as instruções para recuperação.
                  </p>
                </div>

                <div className="col-12 mb-1 field-alterar-senha">
                  <label className="form-label fw-bold form-title form-label-alterar-senha">
                    E-mail UFBA
                    <span className="text-danger ms-1 form-title">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control input-title"
                    id="email-alterar-senha"
                    placeholder="Insira seu e-mail"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-danger error-message">{""}</p>
                </div>
              </div>

              <div className="modal-footer content-alterar-senha">
                <button
                  type="button"
                  className="btn btn-primary button-alterar-senha"
                  onClick={handleSendEmail}
                  disabled={!email}
                >
                  Enviar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
