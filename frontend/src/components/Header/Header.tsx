"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import PerfilOuvinte from "../Perfil/PerfilOuvinte";
import PerfilAdmin from "../Perfil/PerfilAdmin";
import PerfilDoutorando from "../Perfil/PerfilDoutorando";
import "./style.scss";

export default function Header() {
  const { user, signed } = useContext(AuthContext);

  type MenuItem =
    | "inicio"
    | "programação do evento"
    | "orientações"
    | "contato"
    | "login";

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const pathname = usePathname();

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    if (pathname === "/Home") {
      const section = document.getElementById(item);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  function perfil() {
    if (!user) return null;
    switch (user.profile) {
      case "Listener":
        return <PerfilOuvinte />;
      case "Professor":
        return <PerfilAdmin />;
      case "DoctoralStudent":
        return <PerfilDoutorando />;

      default:
        return null;
    }
  }

  useEffect(() => {
    const currentPath = pathname;
    const currentHash = window.location.hash;

    if (currentPath === "/Home") {
      if (currentHash === "#inicio") setSelectedItem("inicio");
      else if (currentHash === "#Programacao")
        setSelectedItem("programação do evento");
      else if (currentHash === "#Orientacao") setSelectedItem("orientações");
      else if (currentHash === "#Contato") setSelectedItem("contato");
      else setSelectedItem(null);
    } else if (currentPath === "/Login") {
      setSelectedItem("login");
    }
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image
            src={"/assets/images/logo_PGCOMP.svg"}
            alt="PGCOMP Logo"
            className="navbar-image"
            width={300}
            height={100}
            priority
          />
        </Link>
        
        <nav className="navbar">
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
        </nav>

        <div className="d-flex justify-content-end navbar-menu-itens">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav align-items-center me-auto mb-2 mb-lg-0 fw-normal">
              <div
                className={`nav-item ${
                  selectedItem === "inicio" ? "fw-bold" : ""
                }`}
                onClick={() => handleItemClick("inicio")}
              >
                <Link className="nav-link text-black" href="/Home">
                  Inicio
                </Link>
              </div>
              <div className="vr text-black"></div>
              <div
                className={`nav-item ${
                  selectedItem === "programação do evento" ? "fw-bold" : ""
                }`}
                onClick={() => handleItemClick("programação do evento")}
              >
                <Link className="nav-link text-black" href="Home#Programacao">
                  Programação do Evento
                </Link>
              </div>
              <div className="vr text-black"></div>
              <div
                className={`nav-item ${
                  selectedItem === "orientações" ? "fw-bold" : ""
                }`}
                onClick={() => handleItemClick("orientações")}
              >
                <Link className="nav-link text-black" href="Home#Orientacao">
                  Orientações
                </Link>
              </div>
              <div className="vr text-black"></div>
              <div
                className={`nav-item ${
                  selectedItem === "contato" ? "fw-bold" : ""
                }`}
                onClick={() => handleItemClick("contato")}
              >
                <Link className="nav-link text-black" href="Home#Contato">
                  Contato
                </Link>
              </div>
              <div className="vr text-black"></div>
              <li className="nav-item">
                {signed ? (
                  perfil()
                ) : (
                  <Link
                    className="nav-link active text-black"
                    aria-current="page"
                    href="/Login"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
