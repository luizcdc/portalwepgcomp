"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import Link from "next/link";
import "./style.scss";

interface PerfilAdminProps {
  profile: ProfileType;
  role: RoleType;
}

export default function PerfilAdmin({
  profile,
  role,
}: Readonly<PerfilAdminProps>) {
  const { logout } = useContext(AuthContext);

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
        {/* <li>
          <Link className="dropdown-item" href="#">
            Emitir Certificado
          </Link>
        </li> */}
        {profile === "DoctoralStudent" && (
          <li>
            <Link className="dropdown-item" href="/minha-apresentacao">
              Minha Apresentação
            </Link>
          </li>
        )}

        {/* {profile === "Professor" && (
          <li>
            <Link className="dropdown-item" href="#">
              Minhas bancas
            </Link>
          </li>
        )} */}

        <li>
          <Link className="dropdown-item" href="/apresentacoes">
            Apresentações
          </Link>
        </li>
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
    </div>
  );
}
