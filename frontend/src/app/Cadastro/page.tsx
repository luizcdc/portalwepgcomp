"use client";

import Link from "next/link";

export default function Cadastro() {
  return (
    <div>
      <div className='container'>
        <h1 className='d-flex justify-content-center mt-5 fw-normal text-primary'>
          WEPGCOMP
          <span className='fw-bold text-primary ms-2'>2024</span>
        </h1>
        <hr className='border border-warning border-2'></hr>
        <h2 className='d-flex justify-content-center mb-4'>Cadastro</h2>
      </div>
      <div className='container d-flex justify-content-center mb-5'>
        <form className='row g-3'>
          <div className='col-12 mb-3'>
            <label className='form-label'>
              Nome completo
              <span className='text-danger ms-1'>*</span>
            </label>
            <input
              type='text'
              className='form-control'
              id='nome'
              placeholder='Insira seu nome'
              required
            />
          </div>
          <div className='col-12 mb-3'>
            <label className='form-label'>
              Matrícula
              <span className='text-danger ms-1'>*</span>
            </label>
            <input
              type='number'
              className='form-control [&::-webkit-inner-spin-button]:appearance-none'
              id='matricula'
              placeholder='Insira sua matrícula'
              required
            />
          </div>
          <div className='col-12 mb-3'>
            <label className='form-label'>
              E-mail UFBA
              <span className='text-danger ms-1'>*</span>
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              placeholder='Insira seu e-mail'
              required
            />
          </div>
          <div className='col-12 mb-3'>
            <label className='form-label'>
              Perfil
              <span className='text-danger ms-1'>*</span>
            </label>
            <div className='d-flex'>
              <div className='form-check me-3'>
                <input
                  type='radio'
                  className='form-check-input'
                  id='radio1'
                  name='perfil'
                  value='professor'
                  defaultChecked
                  required
                />
                <label className='form-check-label' htmlFor='radio1'>
                  Professor
                </label>
              </div>
              <div className='form-check'>
                <input
                  type='radio'
                  className='form-check-input'
                  id='radio2'
                  name='perfil'
                  value='aluno'
                  required
                />
                <label className='form-check-label' htmlFor='radio2'>
                  Aluno
                </label>
              </div>
            </div>
          </div>
          <div className='col-12 mb-3'>
            <label className='form-label'>
              Senha
              <span className='text-danger ms-1'>*</span>
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              placeholder='Insira sua senha'
              required
            />
            <div className='mt-3'>
              <p className='mb-1'>A senha deve possuir pelo menos:</p>
              <ul className='mb-0'>
                <li>8 dígitos</li>
                <li>1 letra maiúscula</li>
                <li>1 letra minúscula</li>
                <li>4 números</li>
                <li>1 caracter especial</li>
              </ul>
            </div>
          </div>
          <div className='col-12 mb-5'>
            <label className='form-label'>
              Confirmação de senha
              <span className='text-danger ms-1'>*</span>
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              placeholder='Insira sua senha novamente'
              required
            />
          </div>
          <div className='d-grid gap-2 col-3 mx-auto'>
            <button
              type='submit'
              className='btn btn-warning text-white fs-5 fw-bold'
            >
              Enviar
            </button>
          </div>
          <p className='text-end'>
            Já tem uma conta?
            <Link
              href='/Login'
              className='link-underline link-underline-opacity-0'
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
