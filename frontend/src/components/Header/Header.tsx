"use client";

import { useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import { AuthContext } from "@/context/AuthProvider/authProvider";

import PerfilOuvinte from "../Perfil/PerfilOuvinte";
import PerfilAdmin from "../Perfil/PerfilAdmin";
import PerfilDoutorando from "../Perfil/PerfilDoutorando";
import PerfilProfessor from "../Perfil/PerfilProfessor";

import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";

export default function Header() {
  const { user, signed } = useContext(AuthContext);
  const {
    listEdicao,
    edicoesList,
    edicaoSelecionada,
    setEdicaoSelecionada,
    getEdicaoByYear,
  } = useEdicao();

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
    if (pathname === "/home") {
      const section = document.getElementById(item);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const yearsOptions = edicoesList
    ?.map((ed) => {
      if (ed.startDate) {
        const fullYear = new Date(ed?.startDate).getFullYear();

        return {
          value: fullYear,
          label: `Edição ${fullYear}`,
          isActive: ed.isActive,
        };
      }

      return { value: "", label: "", isActive: false };
    })
    ?.filter(
      (option, index, self) =>
        option.value &&
        self.findIndex((o) => o.value === option.value) === index
    )
    ?.toSorted((a, b) => Number(b.value) - Number(a.value));

  function perfil() {
    if (!user) return null;
    if (user.level !== "Default")
      return <PerfilAdmin profile={user?.profile} role={user?.level} />;

    switch (user.profile) {
      case "Listener":
        return <PerfilOuvinte />;
      case "Professor":
        return <PerfilProfessor />;
      case "DoctoralStudent":
        return <PerfilDoutorando />;

      default:
        return null;
    }
  }

  useEffect(() => {
    const currentPath = pathname;
    const currentHash = window.location.hash;
    listEdicao();

    if (currentPath === "/home") {
      if (currentHash === "#inicio") setSelectedItem("inicio");
      else if (currentHash === "#Programacao")
        setSelectedItem("programação do evento");
      else if (currentHash === "#Orientacao") setSelectedItem("orientações");
      else if (currentHash === "#Contato") setSelectedItem("contato");
      else setSelectedItem(null);
    } else if (currentPath === "/login") {
      setSelectedItem("login");
    } else {
      setSelectedItem(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (edicaoSelecionada) {
      console.log(edicaoSelecionada);
      getEdicaoByYear(edicaoSelecionada.year);
    }
  }, [edicaoSelecionada.year]);

  useEffect(() => {
    if (edicoesList?.length) {
      const edAtiva = edicoesList?.find((v) => v.isActive);

      setEdicaoSelecionada({
        year: String(new Date(edAtiva?.startDate ?? "").getFullYear()),
        isActive: true,
      });
    }
  }, [edicoesList]);

  return (
    <>
      <div className="header-placeholder">
        <span />
      </div>
      <nav className="navbar navbar-expand-lg fixed">
        <div className="container-fluid">
          <div className="container-brand-edition">
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

            {
              <select
                id="event-edition-select"
                className="form-select event-edition-select"
                value={edicaoSelecionada.year}
                onChange={(ed) =>
                  setEdicaoSelecionada({
                    year: ed.target.value,
                    isActive:
                      yearsOptions.find((v) => v.value == ed.target.value)
                        ?.isActive ?? false,
                  })
                }
              >
                {yearsOptions?.map((op, i) => (
                  <option id={`edicao-op${i}`} key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            }
          </div>

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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav align-items-center me-auto mb-2 mb-lg-0 fw-normal">
                <div
                  className={`nav-item ${
                    selectedItem === "inicio" ? "fw-bold" : ""
                  }`}
                  onClick={() => handleItemClick("inicio")}
                >
                  <Link className="nav-link text-black" href="/home">
                    Início
                  </Link>
                </div>
                {!signed && (
                  <li className="nav-wall">
                    <div className="nav-wall vr text-black"></div>
                  </li>
                )}
                {!signed && (
                  <li className="nav-item">
                    <Link
                      className="nav-link active text-black"
                      aria-current="page"
                      href="/cadastro"
                    >
                      Inscrição
                    </Link>
                  </li>
                )}
                <div className="vr text-black"></div>
                <div
                  className={`nav-item ${
                    selectedItem === "programação do evento" ? "fw-bold" : ""
                  }`}
                  onClick={() => handleItemClick("programação do evento")}
                >
                  <Link
                    className="nav-link text-black tamanho-texto-programacao-evento"
                    href="home#Programacao"
                  >
                    Programação do evento
                  </Link>
                </div>
                <div className="vr text-black"></div>
                <div
                  className={`nav-item ${
                    selectedItem === "orientações" ? "fw-bold" : ""
                  }`}
                  onClick={() => handleItemClick("orientações")}
                >
                  <Link className="nav-link text-black" href="home#Orientacao">
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
                  <Link className="nav-link text-black" href="home#Contato">
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
                      href="/login"
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
    </>
  );
}
