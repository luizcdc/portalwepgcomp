"use client";

import Link from "next/link";

export default function Login() {
  return (
    <div>
      <div className='container'>
        <h1 className='d-flex justify-content-center mt-5 fw-normal text-primary'>
          WEPGCOMP
          <span className='fw-bold text-primary ms-2'>2024</span>
        </h1>
        <hr className='border border-warning border-2'></hr>
        <h2 className='d-flex justify-content-center mb-4'>Acesse sua conta</h2>
      </div>
      <div className='container d-flex justify-content-center mb-5'>
        <form className='row g-3'>
          <div className='col-12 mb-3'>
            <label className='form-label'>
              E-mail
              <span className='text-danger ms-1'>*</span>
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              placeholder='exemplo@ufba.br'
              required
            />
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
              placeholder='digite sua senha'
              required
            />

            <div className='text-end'>
              <a href='#' className='link-underline link-underline-opacity-0'>
                Esqueceu sua senha
              </a>
            </div>
          </div>
          <div className='d-grid gap-2 col-3 mx-auto'>
            <button type='submit' className='btn btn-primary'>
              Entrar
            </button>
          </div>
          <hr className='border border-warning border-2'></hr>
        </form>
      </div>
      <div className='text-center mb-4'>
        <h6>
          Ainda não tem conta?
          <Link
            href='/Cadastro'
            className='link-underline link-underline-opacity-0 ms-1'
          >
            Cadastre-se
          </Link>
        </h6>
      </div>
    </div>
  );
}
