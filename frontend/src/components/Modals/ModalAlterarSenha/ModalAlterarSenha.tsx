"use client";

import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";

import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";

import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";

export default function ModalAlterarSenha() {
  const [email, setEmail] = useState<string>("");

  const { resetPasswordSendEmail, loadingSendEmail } = useUsers();
  const { Edicao } = useEdicao();

  const handleSendEmail = () => {
    if (!email) {
      throw new Error("Campos obrigatórios em branco.");
    } else {
      const body = {
        email,
      };

      resetPasswordSendEmail(body);
    }
  };

  return (
    <ModalComponent
      id='alterarSenhaModal'
      loading={loadingSendEmail}
      labelConfirmButton='Enviar'
      disabledConfirmButton={!email}
      colorButtonConfirm='#0065A3'
      onConfirm={handleSendEmail}
    >
      <div className='modal-alterar-senha'>
        <h1 className='d-flex justify-content-center mt-5 fw-normal border-yellow ms-2'>
          {Edicao?.name || "Carregando..."}
        </h1>
        <hr className='linha-alterar-senha' />

        <div className='content-alterar-senha'>
          <h2>Esqueci minha senha</h2>
          <p>
            Por favor, informe o e-mail cadastrado em sua conta, e enviaremos um
            link com as instruções para recuperação.
          </p>
        </div>

        <div className='col-12 mb-1 field-alterar-senha'>
          <label className='form-label fw-bold form-title form-label-alterar-senha'>
            E-mail
            <span className='text-danger ms-1 form-title'>*</span>
          </label>
          <input
            type='email'
            className='form-control input-title'
            id='email-alterar-senha'
            placeholder='Insira seu e-mail'
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className='text-danger error-message'>{""}</p>
        </div>
      </div>
    </ModalComponent>
  );
}
