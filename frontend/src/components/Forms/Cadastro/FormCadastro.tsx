"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUsers } from "@/hooks/useUsers";
import { zodResolver } from "@hookform/resolvers/zod";

import PasswordEye from "@/components/UI/PasswordEye";
import "./style.scss";

const formCadastroSchema = z
  .object({
    nome: z
      .string({ invalid_type_error: "Campo Inválido" })
      .min(1, "O nome é obrigatório.")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
        message: "Preenchimento obrigatório.",
      }),

    perfil: z.enum(["doutorando", "professor", "ouvinte"], {
      required_error: "A escolha do perfil é obrigatória!",
      invalid_type_error: "Campo inválido!",
    }),

    matricula: z.string().optional(),

    email: z
      .string({
        invalid_type_error: "Campo inválido!",
      })
      .min(1, "O email é obrigatório.")
      .email({
        message: "E-mail inválido!",
      }),

    senha: z
      .string({
        invalid_type_error: "Campo inválido",
      })
      .min(8, {
        message: "A senha é obrigatória e deve ter, pelo menos, 8 caracteres.",
      }),

    confirmaSenha: z
      .string({
        invalid_type_error: "Campo inválido",
      })
      .min(1, {
        message: "Confirmação de senha é obrigatória!",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.perfil !== "ouvinte" && !data.matricula) {
      ctx.addIssue({
        path: ["matricula"],
        message: "A matrícula é obrigatória.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.perfil !== "ouvinte" &&
      data.matricula &&
      data.matricula.length > 20
    ) {
      ctx.addIssue({
        path: ["matricula"],
        message: "A matrícula tem limite de 20 dígitos.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.perfil !== "ouvinte" &&
      data.matricula &&
      !/^\d{1,19}$/.test(data.matricula)
    ) {
      ctx.addIssue({
        path: ["matricula"],
        message:
          "A matrícula precisa conter apenas números e ter menos de 20 dígitos.",
        code: z.ZodIssueCode.custom,
      });
    }
  })
  .refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas não conferem!",
    path: ["confirmaSenha"],
  });

export function FormCadastro() {
  const { registerUser } = useUsers();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormCadastroSchema>({
    resolver: zodResolver(formCadastroSchema),
    defaultValues: {
      perfil: "doutorando",
    },
  });

  type FormCadastroSchema = z.infer<typeof formCadastroSchema>;

  const [senha, setSenha] = useState("");
  const [requisitos, setRequisitos] = useState({
    minLength: false,
    hasLetter: false,
    number: false,
  });

  const handleFormCadastro = (data: FormCadastroSchema) => {
    const { nome, email, senha, matricula, perfil } = data;

    const profileFormated = {
      doutorando: "DoctoralStudent",
      professor: "Professor",
      ouvinte: "Listener",
    };

    if (
      !nome ||
      !email ||
      !senha ||
      !perfil ||
      (perfil !== "ouvinte" && !matricula)
    ) {
      throw new Error("Campos obrigatórios em branco.");
    }

    const body = {
      name: nome,
      email: email,
      password: senha,
      registrationNumber: matricula,
      profile: profileFormated[perfil] as ProfileType,
    };

    registerUser(body);
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

  const perfil = watch("perfil");

  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);

  return (
    <form className="row" onSubmit={handleSubmit(handleFormCadastro)}>
      <div className="col-12 mb-1">
        <label className="form-label fs-5 fw-bold">
          Nome completo
          <span className="text-danger ms-1 fs-5">*</span>
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="nome"
          placeholder="Insira seu nome"
          {...register("nome")}
        />
        <p className="text-danger error-message">{errors.nome?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold fs-5">
          Perfil
          <span className="text-danger ms-1 fs-5">*</span>
        </label>
        <div className="d-flex">
          <div className="form-check me-3">
            <input
              type="radio"
              className="form-check-input"
              id="radio1"
              {...register("perfil")}
              value="doutorando"
            />
            <label
              className="form-check-label fw-bold input-title"
              htmlFor="radio1"
            >
              Doutorando (PGCOMP)
              <i
                className="bi bi-info-circle ms-2"
                data-bs-toggle="tooltip"
                title="Aluno do PGCOMP que irá apresentar projetos no workshop."
              ></i>
            </label>
          </div>
          <div className="form-check me-3">
            <input
              type="radio"
              className="form-check-input"
              id="radio2"
              {...register("perfil")}
              value="professor"
            />
            <label
              className="form-check-label fw-bold input-title"
              htmlFor="radio2"
            >
              Professor (PGCOMP)
              <i
                className="bi bi-info-circle ms-2"
                data-bs-toggle="tooltip"
                title=" Professor do PGCOMP que poderá assistir e avaliar os projetos apresentados no workshop."
              ></i>
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="radio3"
              {...register("perfil")}
              value="ouvinte"
            />
            <label
              className="form-check-label fw-bold input-title"
              htmlFor="radio3"
            >
              Ouvinte
              <i
                className="bi bi-info-circle ms-2"
                data-bs-toggle="tooltip"
                title="Participantes que irão assistir ou expor no workshop."
              ></i>
            </label>
          </div>
        </div>
        <p className="text-danger error-message">{errors.perfil?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold fs-5">
          {perfil === "professor" ? "Matrícula SIAPE" : "Matrícula"}
          {perfil !== "ouvinte" && (
            <span className="text-danger ms-1 fs-5">*</span>
          )}
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="matricula"
          placeholder={
            perfil === "professor"
              ? "Insira sua matrícula SIAPE"
              : "Insira sua matrícula"
          }
          {...register("matricula")}
        />
        <p className="text-danger error-message">{errors.matricula?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold fs-5">
          E-mail {perfil !== "ouvinte" && "UFBA"}
          <span className="text-danger ms-1 fs-5">*</span>
        </label>
        <input
          type="email"
          className="form-control input-title"
          id="email"
          placeholder="Insira seu e-mail"
          {...register("email")}
        />
        <p className="text-danger error-message">{errors.email?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold fs-5">
          Senha
          <span className="text-danger ms-1 fs-5">*</span>
        </label>
        <div className="password-input">
          <input
            type={eye1 ? "text" : "password"}
            className="form-control input-title password"
            id="senha"
            placeholder="Insira sua senha"
            {...register("senha")}
            value={senha}
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
              className={`fw-semibold list-title ${requisitos.minLength ? "text-success" : "text-danger"
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
              className={`fw-semibold list-title ${requisitos.hasLetter ? "text-success" : "text-danger"
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
              className={`fw-semibold list-title ${requisitos.number ? "text-success" : "text-danger"
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
        <label className="form-label fw-bold fs-5">
          Confirmação de senha
          <span className="text-danger ms-1 fs-5">*</span>
        </label>
        <div className="password-input">
          <input
            type={eye2 ? "text" : "password"}
            className="form-control input-title password"
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

      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          type="submit"
          className="btn fw-bold fs-5 text-white submit-button"
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}
