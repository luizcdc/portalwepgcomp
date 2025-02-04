"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import Link from "next/link";
import "./style.scss";
import { useEdicao } from "@/hooks/useEdicao";
import { useCertificate } from "@/services/certificate";
import { useSweetAlert } from "@/hooks/useAlert";
import ModalMelhoresAvaliadores from "../Modals/ModalMelhoresAvaliadores/ModalMelhoresAvaliadores";
import ModalCriterios from "../Modals/ModalCriterios/ModalCriterios";

interface PerfilAdminProps {
  profile: ProfileType;
  role: RoleType;
}

export default function PerfilAdmin({
  profile,
  role,
}: Readonly<PerfilAdminProps>) {
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
        title: "Error ao baixar o certificado!",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn dropdown-toggle border-0"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-list fs-3"></i>
      </button>
      <ul className="dropdown-menu dropdown-menu-end border-3 border-light">
        {role === "Superadmin" && (
          <li>
            <Link className="dropdown-item" href="/edicoes">
              Edições do Evento
            </Link>
          </li>
        )}
        {role === "Superadmin" && (
          <li>
            <Link className="dropdown-item" href="/gerenciamento">
              Gerenciar Usuários
            </Link>
          </li>
        )}
        <li>
          <button className="dropdown-item" onClick={certificateDownload}>
            Emitir Certificado
          </button>
        </li>

        {profile === "DoctoralStudent" && (
          <li>
            <Link className="dropdown-item" href="/minha-apresentacao">
              Minha Apresentação
            </Link>
          </li>
        )}

        {profile === "Professor" && (
          <li>
            <Link className="dropdown-item" href="/minhas-bancas">
              Minhas bancas
            </Link>
          </li>
        )}

        <li>
          <Link className="dropdown-item" href="/apresentacoes">
            Apresentações
          </Link>
        </li>
        <li>
          <button
            className="dropdown-item"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#escolherAvaliadorModal"
          >
            Melhores Avaliadores
          </button>
        </li>
        {(role === "Admin" || role === "Superadmin") && (
          <li>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#criteriosModal"
              className="dropdown-item"
            >
              Gerenciar critérios
            </button>
          </li>
        )}
        <li>
          <Link className="dropdown-item" href="/premiacao">
            Premiação
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/sessoes">
            Sessões
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
      <ModalMelhoresAvaliadores />
      <ModalCriterios />
    </div>
  );
}
