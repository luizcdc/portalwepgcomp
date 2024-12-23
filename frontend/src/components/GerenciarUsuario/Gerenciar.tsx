"use client";

import Image from "next/image";
import "./style.scss";
import { useState } from "react";

export default function Gerenciar() {
  const [isActive, setIsActive] = useState<boolean>(false);

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
          <div className="filtrar">
            FILTRAR
          </div>
          <div className="button-ativo">
            ATIVO
          </div>
          <div className="button-pendente">
            PENDENTE
          </div>
          <div className="button-inativo">
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
        <div className="name"></div>
        <div className="drop-boxes">
          <div className="drop-section">
            <div className="text-status">Status</div>
            <div className="drop-status"></div>
          </div>
          <div className="drop-section">
            <div className="text-permit">Permissão</div>
            <div className="drop-permit"></div>
          </div>
        </div>
      </div>
      <div className="save">Salvar</div>
    </div>
  );
}
