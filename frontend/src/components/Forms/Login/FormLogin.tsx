/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import usePost from "@/services/usePost";
import { useState } from "react";
import "./style.scss";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { IUser } from "@/context/AuthProvider/types";

interface ILogin {
  email: string;
  password: string;
}

export function FormLogin() {

  const { register, handleSubmit} = useForm();
  const { cadastrarDados, error, sucesso } = usePost();
  const auth = useAuth();

  async function handleLogin(data: any ) {   
    const { email, password }  = data;

    const usuario: ILogin = {
      email: email,
      password: password,
    };

    try {
      await auth.authenticate(usuario.email, usuario.password);
      console.log("Chama login")
    //  cadastrarDados({ url: "auth/login", dados: usuario });
    } catch (error) {      
      console.log(error)
      error ;
    }
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(handleLogin)}>
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
          {...register("email")}
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
          {...register("password")}
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
