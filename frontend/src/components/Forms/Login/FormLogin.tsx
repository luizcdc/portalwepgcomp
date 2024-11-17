/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useContext } from "react";
import "./style.scss";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useRouter } from "next/navigation";

export function FormLogin() {
  const { register, handleSubmit} = useForm<UserLogin>();
  const { singIn, signed } = useContext(AuthContext);
  const router = useRouter();

  async function handleLogin(data: UserLogin ) {   
    const { email, password }  = data;
    

    const usuario: UserLogin = { email, password };

    try {
      await singIn(usuario);
    } catch (error) {      

    }
  };

  if(signed) {
    router.push("/")
  } else {

    return (
      <form className="row g-3" onSubmit={handleSubmit(handleLogin)}>
        <hr />
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
}
