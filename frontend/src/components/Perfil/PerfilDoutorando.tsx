"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import Link from "next/link";
import "./style.scss";
import { certificate } from "@/services/certificate";
import { useEdicao } from "@/hooks/useEdicao";
import { useSweetAlert } from "@/hooks/useAlert";

export default function PerfilDoutorando() {
  const { logout } = useContext(AuthContext);
  const { Edicao } = useEdicao();
  const { showAlert } = useSweetAlert();

  const certificateDownload = () => {
    certificate(Edicao?.id || "").then((response) => {
      if (response !== "200") {
        showAlert({
          icon: "error",
          text: response,
          confirmButtonText: "Retornar",
        });
      }
    });
  };

  return (
    <li className="dropdown">
      <button
        className="btn dropdown-toggle border-0"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-list fs-3"></i>
      </button>
      <ul className="dropdown-menu dropdown-menu-end border-3 border-light">
        <li>
          <button className="dropdown-item" onClick={certificateDownload}>
            Emitir Certificado
          </button>
        </li>
        <li>
          <Link className="dropdown-item" href="/minha-apresentacao">
            Minha Apresentação
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/favoritos">
            Favoritos
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/home" onClick={logout}>
            Sair
          </Link>
        </li>
      </ul>
    </li>
  );
}
