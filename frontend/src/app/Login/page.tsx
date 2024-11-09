"use client";

import { FormLogin } from "@/components/Forms/Login/FormLogin";
import "./style.scss";

export default function Login() {
  return (
    <div className="container d-flex flex-column flex-grow-1 text-black">
      <div className="container">
        <h1 className="d-flex justify-content-center mt-5 fw-normal text-primary">
          WEPGCOMP
          <span className="fw-bold text-primary ms-2">2025</span>
        </h1>
        <hr className="border border-warning border-2"></hr>
        <h2 className="d-flex justify-content-center mb-4">Acesse sua conta</h2>
      </div>

      <div className="container d-flex justify-content-center mb-5">
        <FormLogin />
      </div>

      <div className="text-center mb-4">
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
    </div>
  );
}
