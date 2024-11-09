import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formCadastroSchema = z
  .object({
    nome: z
      .string({
        required_error: "Nome é obrigatório!",
        invalid_type_error: "Campo inválido!",
      })
      .regex(/^[a-zA-ZÀ-ÿ]+$/, {
        message: "O campo deve conter apenas letras.",
      }),

    matricula: z
      .string({
        required_error: "Matrícula é obrigatória!",
        invalid_type_error: "Campo inválido!",
      })
      .regex(/^[0-9]+$/, { message: "A matrícula deve conter apenas números." })
      .length(10, { message: "A matrícula precisa conter 10 dígitos." }),

    email: z
      .string({
        required_error: "E-mail é obrigatório!",
        invalid_type_error: "Campo inválido!",
      })
      .email({
        message: "E-mail inválido!",
      }),

    perfil: z.enum(["doutorando", "professor", "ouvinte"], {
      required_error: "A escolha do perfil é obrigatória!",
      invalid_type_error: "Campo inválido!",
    }),

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

export function FormCadastro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
  });

  const handleFormCadastro = (data: FormCadastroSchema) => {
    console.log(data);
  };

  const handleChangeSenha = (e) => {
    const value = e.target.value;
    setSenha(value);

    setRequisitos({
      minLength: value.length >= 8,
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  return (
    <form className="row g-3" onSubmit={handleSubmit(handleFormCadastro)}>
      <div className="col-12 mb-1">
        <label className="form-label fw-bold" style={{ fontSize: "1.25rem" }}>
          Nome completo
          <span className="text-danger ms-1" style={{ fontSize: "1.25rem" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="nome"
          placeholder="Insira seu nome"
          {...register("nome")}
          style={{
            fontSize: "0.9rem",
          }}
        />
        <p className="text-danger">{errors.nome?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold" style={{ fontSize: "1.25rem" }}>
          Matrícula
          <span className="text-danger ms-1" style={{ fontSize: "1.25rem" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="matricula"
          placeholder="Insira sua matrícula"
          {...register("matricula")}
          style={{
            fontSize: "0.9rem",
          }}
        />
        <p className="text-danger">{errors.matricula?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold" style={{ fontSize: "1.25rem" }}>
          E-mail UFBA
          <span className="text-danger ms-1" style={{ fontSize: "1.25rem" }}>*</span>
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Insira seu e-mail"
          {...register("email")}
          style={{
            fontSize: "0.9rem",
          }}
        />
        <p className="text-danger">{errors.email?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold" style={{ fontSize: "1.25rem" }}>
          Perfil
          <span className="text-danger ms-1" style={{ fontSize: "1.25rem" }}>*</span>
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
            <label className="form-check-label fw-bold" htmlFor="radio1" style={{ fontSize: "0.9rem" }}>
              Doutorando
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
            <label className="form-check-label fw-bold" htmlFor="radio2" style={{ fontSize: "0.9rem" }}>
              Professor
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
            <label className="form-check-label fw-bold" htmlFor="radio3" style={{ fontSize: "0.9rem" }}>
              Ouvinte
            </label>
          </div>
        </div>
        <p className="text-danger">{errors.perfil?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold" style={{ fontSize: "1.25rem" }}>
          Senha
          <span className="text-danger ms-1" style={{ fontSize: "1.25rem" }}>*</span>
        </label>
        <input
          type="password"
          className="form-control"
          id="senha"
          placeholder="Insira sua senha"
          {...register("senha")}
          value={senha}
          onChange={handleChangeSenha}
          style={{
            fontSize: "0.9rem",
          }}
        />
        <p className="text-danger">{errors.senha?.message}</p>
        <div className="mt-3">
          <p className="mb-1 fw-semibold" style={{ fontSize: "0.8rem", color: "#555555" }}>A senha deve possuir pelo menos:</p>
          <ul className="mb-0">
            <li
              className={requisitos.minLength ? "text-success" : "text-danger"}
              style={{ fontSize: "0.8rem" }}
            >
              {requisitos.minLength ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              8 dígitos
            </li>
            <li
              className={requisitos.upperCase ? "text-success" : "text-danger"}
              style={{ fontSize: "0.8rem" }}
            >
              {requisitos.upperCase ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              1 letra maiúscula
            </li>
            <li
              className={requisitos.lowerCase ? "text-success" : "text-danger"}
              style={{ fontSize: "0.8rem" }}
            >
              {requisitos.lowerCase ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              1 letra minúscula
            </li>
            <li className={requisitos.number ? "text-success" : "text-danger"} style={{ fontSize: "0.8rem" }} >
              {requisitos.number ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              4 números
            </li>
            <li
              className={
                requisitos.specialChar ? "text-success" : "text-danger"
              }
              style={{ fontSize: "0.8rem" }}
            >
              {requisitos.specialChar ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              1 caracter especial
            </li>
          </ul>
        </div>
      </div>

      <div className="col-12 mb-4">
        <label className="form-label fw-bold" style={{ fontSize: "1.25rem" }}>
          Confirmação de senha
          <span className="text-danger ms-1" style={{ fontSize: "1.25rem" }}>*</span>
        </label>
        <input
          type="password"
          className="form-control"
          id="confirmaSenha"
          placeholder="Insira sua senha novamente"
          {...register("confirmaSenha")}
          style={{
            fontSize: "0.9rem",
          }}
        />
        <p className="text-danger">{errors.confirmaSenha?.message}</p>
      </div>

      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          type="submit"
          className="btn text-white fs-5 fw-bold"
          style={{ backgroundColor: "#FFA90F" }}
        >
          Cadastrar
        </button>
      </div>
    </form >
  );
}
