"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import Link from "next/link";
import "./style.scss";

export default function PerfilAdmin() {
  const { logout } = useContext(AuthContext);
  return (
    <>
      <li className='dropdown'>
        <button
          className='btn dropdown-toggle border-0'
          type='button'
          data-bs-toggle='dropdown'
          aria-expanded='false'
        >
          <i className='bi bi-list fs-3'></i>
        </button>
        <ul className='dropdown-menu dropdown-menu-end border-3 border-light'>
          <li>
            <Link className='dropdown-item' href='/Edicoes'>
              Cadastrar Evento
            </Link>
          </li>
          <li>
            <Link className='dropdown-item' href='#'>
              Emitir Certificado
            </Link>
          </li>
          <li>
            <Link className='dropdown-item' href='/Apresentacoes'>
              Apresentações
            </Link>
          </li>
          <li>
            <Link className='dropdown-item' href='/Premiacao'>
              Premiação
            </Link>
          </li>
          <li>
            <Link className='dropdown-item' href='/Sessoes'>
              Sessões
            </Link>
          </li>
          <li>
            <Link
              className='nav-link active text-black'
              aria-current='page'
              href='/Home'
              onClick={logout}
            >
              Sair
            </Link>
          </li>
        </ul>
      </li>
    </>
  );
}
