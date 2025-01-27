"use client";

import { FormLogin } from "@/components/Forms/Login/FormLogin";
import ModalAlterarSenha from "@/components/Modals/ModalAlterarSenha/ModalAlterarSenha";
import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";

export default function Login() {
  const { Edicao } = useEdicao();
  return (
    <div className='container d-flex flex-column flex-grow-1 text-black'>
      <div className='container'>
        <h1 className='d-flex justify-content-center mt-5 fw-normal border-yellow ms-2'>
          {Edicao?.name || "Carregando..."}
        </h1>
        <hr />
        <h4 className='d-flex justify-content-center mb-4 fw-semibold fs-4'>
          Acesse sua conta
        </h4>
      </div>

      <div className='container d-flex flex-column'>
        <div className='row'>
          <div className='col-12'>
            <div className='container d-flex justify-content-center'>
              <FormLogin />
            </div>
          </div>
        </div>
      </div>

      <div className='container d-flex justify-content-center mb-4  flex-grow-1'>
        <div className='text-start fixed-width'>
          <h6>
            Ainda não tem conta?
            <a
              href='/cadastro'
              className='link-underline link-underline-opacity-0 ms-1'
            >
              Cadastre-se
            </a>
          </h6>
        </div>
      </div>

      <ModalAlterarSenha />
    </div>
  );
}
