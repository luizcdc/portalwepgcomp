"use client";

import { useUsers } from "@/hooks/useUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.scss";

const formAlterarSenhaSchema = z
  .object({
    senha: z
      .string({
        required_error: "Senha é obrigatória!",
        invalid_type_error: "Campo inválido",
      })
      .min(8, { message: "A senha deve ter, pelo menos, 8 caracteres." }),

    confirmaSenha: z.string({
      required_error: "Confirmação de senha é obrigatória!",
      invalid_type_error: "Campo inválido",
    }),
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas não conferem!",
    path: ["confirmaSenha"],
  });

export function FormAlterarSenha({ params }) {
  const { resetPassword } = useUsers();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormAlterarSenhaSchema>({
    resolver: zodResolver(formAlterarSenhaSchema),
  });

  type FormAlterarSenhaSchema = z.infer<typeof formAlterarSenhaSchema>;

  const [senha, setSenha] = useState("");
  const [requisitos, setRequisitos] = useState({
    minLength: false,
    hasLetter: false,
    number: false,
  });

  const handleFormCadastro = (data: FormAlterarSenhaSchema) => {
    const { senha, confirmaSenha } = data;

    if (!senha || !confirmaSenha) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const body = {
      token: params.token,
      newPassword: senha,
    };

    resetPassword(body);
  };

  const handleChangeSenha = (e) => {
    const value = e.target.value;
    setSenha(value);

    setRequisitos({
      minLength: value.length >= 8,
      hasLetter: /[a-zA-Z]/.test(value),
      number: /\d/.test(value)
    });
  };

  return (
    <form className='row' onSubmit={handleSubmit(handleFormCadastro)}>
      <div className='col-12 mb-1'>
        <label className='form-label fw-bold form-title'>
          Senha
          <span className='text-danger ms-1 form-title'>*</span>
        </label>
        <input
          type='password'
          className='form-control input-title'
          id='senha'
          placeholder='Insira sua senha'
          {...register("senha")}
          value={senha}
          onChange={handleChangeSenha}
        />
        <p className='text-danger error-message'>{errors.senha?.message}</p>
        <div className='mt-3'>
          <p className='mb-1 fw-semibold paragraph-title'>
            A senha deve possuir pelo menos:
          </p>
          <ul className='mb-0'>
            <li
              className={`fw-semibold list-title ${
                requisitos.minLength ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.minLength ? (
                <i className='bi bi-shield-fill-check' />
              ) : (
                <i className='bi bi-shield-fill-x' />
              )}{" "}
              8 dígitos
            </li>
            <li
              className={`fw-semibold list-title ${
                requisitos.hasLetter ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.hasLetter ? (
                <i className='bi bi-shield-fill-check' />
              ) : (
                <i className='bi bi-shield-fill-x' />
              )}{" "}
              1 letra
            </li>
            <li
              className={`fw-semibold list-title ${
                requisitos.number ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.number ? (
                <i className='bi bi-shield-fill-check' />
              ) : (
                <i className='bi bi-shield-fill-x' />
              )}{" "}
              1 número
            </li>
          </ul>
        </div>
      </div>

      <div className='col-12 mb-4'>
        <label className='form-label fw-bold form-title'>
          Confirmação de senha
          <span className='text-danger ms-1 form-title'>*</span>
        </label>
        <input
          type='password'
          className='form-control input-title'
          id='confirmaSenha'
          placeholder='Insira sua senha novamente'
          {...register("confirmaSenha")}
        />
        <p className='text-danger error-message'>
          {errors.confirmaSenha?.message}
        </p>
      </div>

      <div className='d-grid gap-2 col-3 mx-auto'>
        <button
          type='submit'
          className='btn text-white fs-5 fw-bold submit-button'
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
