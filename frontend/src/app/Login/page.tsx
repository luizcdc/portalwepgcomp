"use client";

import usePost from "@/services/usePost";
import Link from "next/link";
import React, { useState } from "react";

interface ILogin {
  email: string;
  password: string;
}

export default function Login() {
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
    <div className="container" style={{display: "flex", flexDirection: "column", flexGrow: 1, color: "black"}}>
      <div className="container">
        <h1 className="d-flex justify-content-center mt-5 fw-normal text-primary">
          WEPGCOMP
          <span className="fw-bold text-primary ms-2">2025</span>
        </h1>
        <hr className="border border-warning border-2"></hr>
        <h2 className="d-flex justify-content-center mb-4">Acesse sua conta</h2>
      </div>
      <div className="container d-flex justify-content-center mb-5">
        <form className="row g-3" onSubmit={handleLogin}>
          <div className="col-12 mb-3">
            <label className="form-label">
              E-mail
              <span className="text-danger ms-1">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="exemplo@ufba.br"
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">
              Senha
              <span className="text-danger ms-1">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="digite sua senha"
              required
            />

            <div className="text-end">
              <a href="#" className="link-underline link-underline-opacity-0" style={{color: "blue"}}>
                Esqueceu sua senha
              </a>
            </div>
          </div>
          <div className="d-grid gap-2 col-3 mx-auto">
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
          </div>
          <hr className="border border-warning border-2"></hr>
        </form>
      </div>
      <div className="text-center mb-4">
        <h6>
          Ainda não tem conta?
          <Link
            href="/Cadastro"
            className="link-underline link-underline-opacity-0 ms-1"
            style={{color: "blue"}}
          >
            Cadastre-se
          </Link>
        </h6>
      </div>
    </div>
  );
}
