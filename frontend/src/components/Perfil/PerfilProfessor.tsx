"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import Link from "next/link";
import "./style.scss";
import { useCertificate } from "@/services/certificate";
import { useEdicao } from "@/hooks/useEdicao";
import { useSweetAlert } from "@/hooks/useAlert";

export default function PerfilProfessor() {
  const { logout } = useContext(AuthContext);
  const { Edicao } = useEdicao();
  const { showAlert } = useSweetAlert();
  const { downloadCertificate } = useCertificate();

  const certificateDownload = async () => {
    const response = await downloadCertificate(Edicao?.id || "");

    if (response === 200) {
      showAlert({
        icon: "success",
        title: "Download feito com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } else if (response === 404) {
      showAlert({
        icon: "error",
        title:
          "Professor não participou de mesas avaliadoras, portanto não pode receber certificado",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
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
          <button className='dropdown-item' onClick={certificateDownload}>
            Emitir Certificado
          </button>
        </li>
        <li>
          <Link className='dropdown-item' href='/minhas-bancas'>
            Minhas bancas
          </Link>
        </li>
        <li>
          <Link className='dropdown-item' href='/favoritos'>
            Favoritos
          </Link>
        </li>
        <li>
          <Link className='dropdown-item' href='/home' onClick={logout}>
            Sair
          </Link>
        </li>
      </ul>
    </li>
  );
}
