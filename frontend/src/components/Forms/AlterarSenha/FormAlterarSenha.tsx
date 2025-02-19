"use client";

import { useUsers } from "@/hooks/useUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.scss";
import PasswordEye from "@/components/UI/PasswordEye";

const formAlterarSenhaSchema = z
  .object({
    senha: z
      .string()
      .nonempty("Senha é obrigatória!")
      .min(8, "A senha deve ter no mínimo 8 caracteres."),

    confirmaSenha: z.string().nonempty("Confirmação de senha é obrigatória!"),
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas não conferem!",
    path: ["confirmaSenha"],
  });

export function FormAlterarSenha({ params }) {
  const { resetPassword } = useUsers();
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormAlterarSenhaSchema>({
    resolver: zodResolver(formAlterarSenhaSchema),
  });

  type FormAlterarSenhaSchema = z.infer<typeof formAlterarSenhaSchema>;

  const [requisitos, setRequisitos] = useState({
    minLength: false,
    hasLetter: false,
    number: false,
  });

  const handleFormCadastro = (data: FormAlterarSenhaSchema) => {
    const { senha } = data;

    const body = {
      token: params.token,
      newPassword: senha,
    };

    resetPassword(body);
  };

  const handleChangeSenha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setRequisitos({
      minLength: value.length >= 8,
      hasLetter: /[a-zA-Z]/.test(value),
      number: /\d/.test(value),
    });
  };

  return (
    <form className="row" onSubmit={handleSubmit(handleFormCadastro)}>
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Senha
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <div className="d-flex flex-direction-row gap-2 align-items-center">
          <input
            type={eye1 ? "text" : "password"}
            className="form-control input-title"
            id="senha"
            placeholder="Insira sua senha"
            {...register("senha")}
            onChange={handleChangeSenha}
          />
          <div className="eye" onClick={() => setEye1(!eye1)}>
            <PasswordEye color={eye1 == false ? "black" : "blue"} />
          </div>
        </div>
        <p className="text-danger error-message">{errors.senha?.message}</p>
        <div className="mt-3">
          <p className="mb-1 fw-semibold paragraph-title">
            A senha deve possuir pelo menos:
          </p>
          <ul className="mb-0">
            <li
              className={`fw-semibold list-title ${
                requisitos.minLength ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.minLength ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              8 dígitos
            </li>
            <li
              className={`fw-semibold list-title ${
                requisitos.hasLetter ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.hasLetter ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              1 letra
            </li>
            <li
              className={`fw-semibold list-title ${
                requisitos.number ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.number ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              1 número
            </li>
          </ul>
        </div>
      </div>

      <div className="col-12 mb-4">
        <label className="form-label fw-bold form-title">
          Confirmação de senha
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <div className="d-flex flex-direction-row gap-2 align-items-center">
          <input
            type={eye2 ? "text" : "password"}
            className="form-control input-title"
            id="confirmaSenha"
            placeholder="Insira sua senha novamente"
            {...register("confirmaSenha")}
          />
          <div className="eye" onClick={() => setEye2(!eye2)}>
            <PasswordEye color={eye2 == false ? "black" : "blue"} />
          </div>
        </div>
        <p className="text-danger error-message">
          {errors.confirmaSenha?.message}
        </p>
      </div>

      <div className="d-flex gap-2 col-6 mx-auto justify-content-center align-items-center">
        <button
          type="submit"
          className="btn  text-white fs-5 fw-bold submit-button "
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
