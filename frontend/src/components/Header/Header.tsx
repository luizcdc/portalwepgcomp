"use client";
import Image from "next/image";
import Link from "next/link";
import "./style.scss";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";

export default function Header() {
  const { signed, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand">
          <Image
            src={"/assets/images/logo_PGCOMP.svg"}
            alt="PGCOMP Logo"
            width={300}
            height={100}
            priority
          />
        </a>

        <div className="d-flex justify-content-end me-5">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-black" href="/Home">
                  Início
                </Link>
              </li>
              <div className="vr text-black"></div>
              <li className="nav-item">
                <Link className="nav-link text-black" href="#Programacao">
                  Programação do Evento
                </Link>
              </li>
              <div className="vr text-black"></div>
              <li className="nav-item">
                <Link className="nav-link text-black" href="#Orientacao">
                  Orientações
                </Link>
              </li>
              <div className="vr text-black"></div>
              <li className="nav-item">
                <Link className="nav-link text-black" href="#Contato">
                  Contato
                </Link>
              </li>
              <div className='vr text-black'></div>
              <li className='nav-item'>
                { signed 
                    ?
                    <Link
                      className='nav-link active text-black'
                      aria-current='page'
                      href='/Home'
                      onClick={ logout }
                    >
                      Logout
                    </Link>                    
                    :
                      <Link
                      className='nav-link active text-black'
                      aria-current='page'
                      href='/Login'
                    >
                      Login                    
                    </Link>
                }
                
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
