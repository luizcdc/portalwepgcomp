"use client";

import Image from "next/image";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import LoadingPage from "../LoadingPage";
import { AuthContext } from "@/context/AuthProvider/authProvider";

export default function Gerenciar() {
  const [ativo, setAtivo] = useState<boolean>(false);
  const [pendente, setPendente] = useState<boolean>(false);
  const [inativo, setInativo] = useState<boolean>(false);
  const [spAdmin, setSpAdmin] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  const [normal, setNormal] = useState<boolean>(false);

  const { user } = useContext(AuthContext);

  const {
    userList,
    markAsAdminUser,
    markAsDefaultUser,
    markAsSpAdminUser,
    switchActiveUser,
    loadingUserList,
    getUsers,
  } = useUsers();

  const statusOptions = ["ATIVO", "PENDENTE", "INATIVO"];
  const permissionsOptions = ["SUP ADMINISTRADOR", "ADMINISTRADOR", "NORMAL"];

  const getStatus = (isActive: boolean, isPending: boolean) => {
    if (isActive) {
      return "ATIVO";
    }

    if (isPending) {
      return "PENDENTE";
    }

    return "INATIVO";
  };

  const getPermission = (role: RoleType) => {
    const rolesOptions = {
      Superadmin: "SUP ADMINISTRADOR",
      Admin: "ADMINISTRADOR",
      Default: "NORMAL",
    };

    return rolesOptions[role];
  };

  const userStatusClassname = {
    ATIVO: "button-ativo-true",
    PENDENTE: "button-pendente-true",
    INATIVO: "button-pendente-false",
  };

  const buttonsStatusClassname = {
    ATIVO: ativo ? "button-ativo-true" : "button-ativo-false",
    PENDENTE: pendente ? "button-pendente-true" : "button-pendente-false",
    INATIVO: inativo ? "button-inativo-true" : "button-inativo-false",
    ["SUP ADMINISTRADOR"]: spAdmin ? "button-ativo-true" : "button-ativo-false",
    ADMINISTRADOR: admin ? "button-pendente-true" : "button-pendente-false",
    NORMAL: normal ? "button-inativo-true" : "button-inativo-false",
  };

  const handleFilter = {
    ATIVO: () => setAtivo(!ativo),
    PENDENTE: () => setPendente(!pendente),
    INATIVO: () => setInativo(!inativo),
    ["SUP ADMINISTRADOR"]: () => setSpAdmin(!spAdmin),
    ADMINISTRADOR: () => setAdmin(!admin),
    NORMAL: () => setNormal(!normal),
  };

  const handleUserPermission = (targetUser: User, newPermission: string) => {
    const body: SetPermissionParams = {
      requestUserId: user?.id ?? "",
      targetUserId: targetUser.id,
    };

    if (newPermission === "SUP ADMINISTRADOR") {
      return markAsSpAdminUser(body);
    }

    if (newPermission === "ADMINISTRADOR") {
      return markAsAdminUser(body);
    }

    return markAsDefaultUser(body);
  };

  return (
    <div className="gerenciador">
      <div className="filtros">
        <div className="pesquisar">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquise pelo nome do usuário"
          />

          <div
            className="btn btn-outline-secondary border border-0 search-button d-flex justify-content-center align-items-center"
            id="button-addon2"
          >
            <Image
              src="/assets/images/search.svg"
              alt="Search icon"
              height={24}
              width={24}
            />
          </div>
        </div>

        <div className="status d-flex flex-column align-items-start">
          <div className="filtrar mt-3 text-black">FILTRAR</div>
          <div className="d-flex">
            {statusOptions?.map((status) => (
              <button
                key={status}
                className={`${buttonsStatusClassname[status]} button-status`}
                onClick={handleFilter[status]}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="d-flex mb-3">
            {permissionsOptions?.map((permission) => (
              <button
                key={permission}
                className={`${buttonsStatusClassname[permission]} button-status`}
                onClick={handleFilter[permission]}
              >
                {permission}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="description">
        Usuário Ativo: Usuário com cadastro validado e ativo no sistema.
      </div>
      <div className="description">
        Usuário Pendente: Usuário cujo cadastro aguarda aprovação pela comissão
        (geralmente professores).
      </div>
      <div className="description">
        Usuário Inativo: Usuário com cadastro inválido ou negado pela comissão
        no sistema.
      </div>

      {!!loadingUserList && <LoadingPage />}

      {!loadingUserList &&
        userList?.map((userValue) => {
          const userStatus = getStatus(userValue.isActive, false);
          const userPermission = getPermission(userValue.level);

          return (
            <div key={userValue.id} className="users">
              <div className="name">{userValue.name}</div>
              <div className="drop-boxes">
                <div className="drop-section">
                  <div className="drop-text">Status:</div>
                  <div className="dropdown-center">
                    <select
                      className={`${userStatusClassname[userStatus]} dropdown-toggle border-0 text-center`}
                      onChange={() => {
                        switchActiveUser(userValue.id);
                      }}
                      value={userStatus}
                    >
                      {statusOptions?.map((status) => (
                        <option
                          key={status}
                          className="drop-button1"
                          style={{
                            display:
                              status === userStatus || status === "PENDENTE"
                                ? "none"
                                : "block",
                          }}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="drop-section">
                  <div className="drop-text">Permissão:</div>
                  <div className="dropdown">
                    <select
                      className={`drop-permit dropdown-toggle`}
                      onChange={(permission) => {
                        handleUserPermission(
                          userValue,
                          permission.target.value
                        );
                      }}
                      value={userPermission}
                    >
                      {permissionsOptions?.map((permission) => (
                        <option
                          key={permission}
                          disabled={userPermission === permission}
                          className="drop-button1"
                        >
                          {permission}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
