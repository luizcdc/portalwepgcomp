/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import usePost from "@/services/usePost";
import { useState } from "react";
import "./style.scss";

interface ILogin {
  email: string;
  password: string;
}

export function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { cadastrarDados, error, sucesso } = usePost();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const usuario: ILogin = {
      email: email,
      password: password,
    };

    try {
      cadastrarDados({ url: "auth/login", dados: usuario });
    } catch (error) {
      error && alert("Não foi possível realizar o login!");
    }
  };

  return (
    <form className="row g-3" onSubmit={handleLogin}>
      <div className="col-12 mb-3">
        <label className="form-label fw-bold form-title">
          E-mail
          <span className="text-danger ms-1">*</span>
        </label>
        <input
          type="email"
          className="form-control input-title"
          id="email"
          placeholder="exemplo@ufba.br"
          required
        />
      </div>
      <div className="col-12 mb-3">
        <label className="form-label fw-bold form-title">
          Senha
          <span className="text-danger ms-1">*</span>
        </label>
        <input
          type="password"
          className="form-control input-title"
          id="password"
          placeholder="digite sua senha"
          required
        />

        <div className="text-end link">
          <button
            data-bs-target="#alterarSenhaModal"
            type="button"
            data-bs-toggle="modal"
            className="text-end link link-underline link-underline-opacity-0 button-password"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </div>
      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          type="submit"
          className="btn text-white fw-semibold button-primary"
        >
          Entrar
        </button>
      </div>
      <hr />
    </form>
  );
}
