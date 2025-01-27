/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { AuthContext } from "@/context/AuthProvider/authProvider";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordEye from "@/components/UI/PasswordEye";

import "./style.scss";

const formLoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Campo inválido!",
    })
    .min(1, "Verifique seu email")
    .email({
      message: "Verifique seu email",
    }),
  password: z
    .string({
      invalid_type_error: "Campo inválido",
    })
    .min(1, {
      message: "Verifique sua senha",
    }),
});

type FormLoginSchema = z.infer<typeof formLoginSchema>;

export function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormLoginSchema>({
    resolver: zodResolver(formLoginSchema),
  });
  const { singIn, signed } = useContext(AuthContext);
  const router = useRouter();

  const [eye, setEye] = useState(false);

  async function handleLogin(data: UserLogin) {
    const { email, password } = data;

    const usuario: UserLogin = { email, password };

    try {
      await singIn(usuario);
    } catch (error) {}
  }

  if (signed) {
    router.push("/home");
  } else {
    return (
      <form className='row login' onSubmit={handleSubmit(handleLogin)}>
        <div className='col-12 mb-3'>
          <label className='form-label fw-bold form-title'>
            E-mail
            <span className='text-danger ms-1'>*</span>
          </label>
          <input
            type='email'
            className='form-control input-title'
            id='email'
            placeholder='exemplo@ufba.br'
            {...register("email")}
          />
          <p className='text-danger error-message'>{errors.email?.message}</p>
        </div>
        <div className='col-12 mb-3'>
          <label className='form-label fw-bold form-title'>
            Senha
            <span className='text-danger ms-1'>*</span>
          </label>
          <div className='password-input'>
            <input
              type={eye ? "text" : "password"}
              className='form-control input-title password'
              id='password'
              placeholder='digite sua senha'
              {...register("password")}
            />
            <div className='eye' onClick={() => setEye(!eye)}>
              <PasswordEye color={eye == false ? "black" : "blue"} />
            </div>
          </div>
          <p className='text-danger error-message'>
            {errors.password?.message}
          </p>

          <div className='text-end link'>
            <button
              data-bs-target='#alterarSenhaModal'
              type='button'
              data-bs-toggle='modal'
              className='text-end link link-underline link-underline-opacity-0 button-password'
            >
              Esqueceu sua senha?
            </button>
          </div>
        </div>
        <div className='d-flex gap-2 mx-auto mb-4'>
          <button
            type='submit'
            className='btn text-white fw-semibold fs-6 button-primary'
          >
            Entrar
          </button>
        </div>
        <hr />
      </form>
    );
  }
}
