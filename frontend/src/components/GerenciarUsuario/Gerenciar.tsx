"use client";

import Image from "next/image";
import "./style.scss";
import { useState } from "react";

export default function Gerenciar() {
  const [ativo, setAtivo] = useState<boolean>(false);
  const [pendente, setPendente] = useState<boolean>(false);
  const [inativo, setInativo] = useState<boolean>(false);

  const [userStatus, setUserStatus] = useState<number>(0);
  const [userPermission, setUserPermission] = useState<number>(0);

  const getStatus = () => {
    switch (userStatus) {
      case 0:
        return "ATIVO";
      case 1:
        return "PENDENTE";
      case 2:
        return "INATIVO";
    }
  };

  const getPermission = () => {
    switch (userPermission) {
      case 2:
        return "SUP ADMINISTRADOR";
      case 1:
        return "ADMINISTRADOR";
      case 0:
        return "NORMAL";
    }
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

        <div className="status">
          <div className="filtrar">FILTRAR</div>

          <div
            className={
              ativo == true ? "button-ativo-true" : "button-ativo-false"
            }
            onClick={() => setAtivo(!ativo)}
          >
            ATIVO
          </div>

          <div
            className={
              pendente == true
                ? "button-pendente-true"
                : "button-pendente-false"
            }
            onClick={() => setPendente(!pendente)}
          >
            PENDENTE
          </div>

          <div
            className={
              inativo == true ? "button-inativo-true" : "button-inativo-false"
            }
            onClick={() => setInativo(!inativo)}
          >
            INATIVO
          </div>
        </div>
      </div>

      <div className="description">
        Usuário Ativo: Usuário com cadastro validado e ativo no sistema.
        <br />
        Usuário Pendente: Usuário cujo cadastro aguarda aprovação pela comissão
        (geralmente professores).
        <br />
        Usuário Inativo: Usuário com cadastro inválido ou negado pela comissão
        no sistema.
      </div>

      <div className="users">
        <div className="name">Nome do usuário</div>
        <div className="drop-boxes">
          <div className="drop-section">
            <div className="drop-text">Status:</div>
            <div className="dropdown-center">
              <button
                className={
                  userStatus == 0
                    ? "button-ativo-true dropdown-toggle border-0"
                    : userStatus == 1
                    ? "button-pendente-true dropdown-toggle border-0"
                    : "button-inativo-true dropdown-toggle border-0"
                }
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {getStatus()}
              </button>
              <ul className="dropdown-menu border-3 border-light">
                <div className="drop-button1" onClick={() => setUserStatus(0)}>
                  ATIVO
                </div>
                <div className="drop-button1" onClick={() => setUserStatus(1)}>
                  PENDENTE
                </div>
                <div className="drop-button1" onClick={() => setUserStatus(2)}>
                  INATIVO
                </div>
              </ul>
            </div>
          </div>

          <div className="drop-section">
            <div className="drop-text">Permissão:</div>
            <div className="dropdown">
              <button
                className="drop-permit dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {getPermission()}
              </button>
              <ul className="dropdown-menu border-3 border-light">
                <div
                  className="drop-button2"
                  onClick={() => setUserPermission(2)}
                >
                  SUP ADMINISTRADOR
                </div>
                <div
                  className="drop-button2"
                  onClick={() => setUserPermission(1)}
                >
                  ADMINISTRADOR
                </div>
                <div
                  className="drop-button2"
                  onClick={() => setUserPermission(0)}
                >
                  NORMAL
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="save">Salvar</div>
    </div>
  );
}
