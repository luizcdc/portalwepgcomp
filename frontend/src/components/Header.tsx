"use client";
import Image from "next/image";
import logo_PGCOMP from "@/assets/images/logo_PGCOMP.svg";
import Link from "next/link";

export default function Header() {
  return (
    <nav className='navbar navbar-expand-lg'>
      <div className='container-fluid'>
        <a className='navbar-brand'>
          <Image src={logo_PGCOMP} alt='PGCOMP Logo' />
        </a>

        <div className='d-flex justify-content-end me-5'>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>

          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul
              className='navbar-nav me-auto mb-2 mb-lg-0'
              style={{
                gap: "15px",
              }}
            >
              <li className='nav-item'>
                <Link className='nav-link text-black' href='/Home'>
                  Início
                </Link>
              </li>
              <div className='vr'></div>
              <li className='nav-item'>
                <Link className='nav-link text-black' href='#Programacao'>
                  Programação do Evento
                </Link>
              </li>
              <div className='vr'></div>
              <li className='nav-item'>
                <Link className='nav-link text-black' href='#Orientacao'>
                  Orientações
                </Link>
              </li>
              <div className='vr'></div>
              <li className='nav-item'>
                <Link className='nav-link text-black' href='#Contato'>
                  Contato
                </Link>
              </li>
              <div className='vr'></div>
              <li className='nav-item'>
                <Link
                  className='nav-link active text-black'
                  aria-current='page'
                  href='/Login'
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
