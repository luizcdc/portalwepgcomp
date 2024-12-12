"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import "./style.scss";
import ModalComponent from "@/components/UI/ModalComponent/ModalComponent";

export default function ModalAlterarSenha() {
  const [email, setEmail] = useState<string>("");

  const { resetPasswordSendEmail, loadingSendEmail } = useUsers();

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
        <h1 className='d-flex justify-content-center mt-5 fw-normal title-alterar-senha'>
          WEPGCOMP
          <span className='ms-2'>2025</span>
        </h1>

        <hr className='linha-alterar-senha' />

        <div className='content-alterar-senha'>
          <h2>Esqueci minha Senha</h2>
          <p>
            Por favor, informe o e-mail cadastrado em sua conta, e enviaremos um
            link com as instruções para recuperação.
          </p>
        </div>

        <div className='col-12 mb-1 field-alterar-senha'>
          <label className='form-label fw-bold form-title form-label-alterar-senha'>
            E-mail UFBA
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
