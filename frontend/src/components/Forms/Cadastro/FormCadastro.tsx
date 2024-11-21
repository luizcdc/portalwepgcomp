import { useUsers } from "@/hooks/useUsers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./style.scss";

const formCadastroSchema = z
  .object({
    nome: z
      .string({
        required_error: "Nome é obrigatório!",
        invalid_type_error: "Campo inválido!",
      })
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
        message: "O campo deve conter apenas letras.",
      }),

    perfil: z.enum(["doutorando", "professor", "ouvinte"], {
      required_error: "A escolha do perfil é obrigatória!",
      invalid_type_error: "Campo inválido!",
    }),

    matricula: z.string().optional(),

    email: z
      .string({
        required_error: "E-mail é obrigatório!",
        invalid_type_error: "Campo inválido!",
      })
      .email({
        message: "E-mail inválido!",
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
  .superRefine((data, ctx) => {
    if (data.perfil !== "ouvinte" && !data.matricula) {
      ctx.addIssue({
        path: ["matricula"],
        message: "A matrícula precisa ser preenchida corretamente!",
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.perfil !== "ouvinte" &&
      data.matricula &&
      data.matricula.length !== 10
    ) {
      ctx.addIssue({
        path: ["matricula"],
        message: "A matrícula precisa ter 10 dígitos.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.perfil !== "ouvinte" &&
      data.matricula &&
      !/^\d{10}$/.test(data.matricula)
    ) {
      ctx.addIssue({
        path: ["matricula"],
        message:
          "A matrícula precisa conter apenas números e ter exatamente 10 dígitos.",
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
    upperCase: false,
    lowerCase: false,
    number: false,
    specialChar: false,
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
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      number: /\d{4,}/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const perfil = watch("perfil");

  return (
    <form className="row g-3" onSubmit={handleSubmit(handleFormCadastro)}>
      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Nome completo
          <span className="text-danger ms-1 form-title">*</span>
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
        <label className="form-label fw-bold form-title">
          Perfil
          <span className="text-danger ms-1 form-title">*</span>
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
            <label
              className="form-check-label fw-bold input-title"
              htmlFor="radio2"
            >
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
            <label
              className="form-check-label fw-bold input-title"
              htmlFor="radio3"
            >
              Ouvinte
            </label>
          </div>
        </div>
        <p className="text-danger error-message">{errors.perfil?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          Matrícula
          {perfil !== "ouvinte" && (
            <span className="text-danger ms-1 form-title">*</span>
          )}
        </label>
        <input
          type="text"
          className="form-control input-title"
          id="matricula"
          placeholder="Insira sua matrícula"
          {...register("matricula")}
        />
        <p className="text-danger error-message">{errors.matricula?.message}</p>
      </div>

      <div className="col-12 mb-1">
        <label className="form-label fw-bold form-title">
          E-mail UFBA
          <span className="text-danger ms-1 form-title">*</span>
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
        <label className="form-label fw-bold form-title">
          Senha
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="password"
          className="form-control input-title"
          id="senha"
          placeholder="Insira sua senha"
          {...register("senha")}
          value={senha}
          onChange={handleChangeSenha}
        />
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
                requisitos.upperCase ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.upperCase ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              1 letra maiúscula
            </li>
            <li
              className={`fw-semibold list-title ${
                requisitos.lowerCase ? "text-success" : "text-danger"
              }`}
            >
              {requisitos.lowerCase ? (
                <i className="bi bi-shield-fill-check" />
              ) : (
                <i className="bi bi-shield-fill-x" />
              )}{" "}
              1 letra minúscula
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
              4 números
            </li>
            <li
              className={`fw-semibold list-title ${
                requisitos.specialChar ? "text-success" : "text-danger"
              }`}
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
        <label className="form-label fw-bold form-title">
          Confirmação de senha
          <span className="text-danger ms-1 form-title">*</span>
        </label>
        <input
          type="password"
          className="form-control input-title"
          id="confirmaSenha"
          placeholder="Insira sua senha novamente"
          {...register("confirmaSenha")}
        />
        <p className="text-danger error-message">
          {errors.confirmaSenha?.message}
        </p>
      </div>

      <div className="d-grid gap-2 col-3 mx-auto">
        <button
          type="submit"
          className="btn text-white fs-5 fw-bold submit-button"
        >
          Cadastrar
        </button>
      </div>
    </form>
  );
}
