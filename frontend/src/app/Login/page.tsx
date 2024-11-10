"use client";

import { FormLogin } from "@/components/Forms/Login/FormLogin";
import "./style.scss";
import ModalAlterarSenha from "@/components/ModalAlterarSenha/ModalAlterarSenha";

export default function Login() {
  return (
    <div className="container d-flex flex-column flex-grow-1 text-black">
      <div className="container">
        <h1 className="d-flex justify-content-center mt-5 fw-normal">
          WEPGCOMP
          <span className="ms-2">2025</span>
        </h1>
        <hr />
        <h2 className="d-flex justify-content-center mb-4 fw-semibold">
          Acesse sua conta
        </h2>
      </div>

      <div className="container d-flex justify-content-center mb-5">
        <FormLogin />
      </div>

      <div className="text-center mb-4 link">
        <h6>
          Ainda não tem conta?
          <a
            href="/Cadastro"
            className="link-underline link-underline-opacity-0 ms-1"
          >
            Cadastre-se
          </a>
        </h6>
      </div>

      <ModalAlterarSenha />
    </div>
  );
}
