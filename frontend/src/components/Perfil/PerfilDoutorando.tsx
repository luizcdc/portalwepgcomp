"use client";
import Link from "next/link";
import "./style.scss";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";

export default function PerfilDoutorando() {
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
            <Link className='dropdown-item' href='#'>
              Emitir Certificado
            </Link>
          </li>
          <li>
            <Link className='dropdown-item' href='#'>
              Apresentação
            </Link>
          </li>
          <li>
              <Link className='dropdown-item' href='/Home' onClick={logout}>
                Sair
              </Link>
          </li>
        </ul>
      </li>
    </>
  );
}
