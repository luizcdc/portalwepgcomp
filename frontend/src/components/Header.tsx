"use client";
import Image from 'next/image'
import logo_PGCOMP from '@/assets/images/logo_PGCOMP.svg'

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand">
                    <Image
                        src={logo_PGCOMP}
                        alt="PGCOMP Logo"
                    />
                </a>

                <div className="d-flex justify-content-end">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Início</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Sobre</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Programação do Evento</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Orientações</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};