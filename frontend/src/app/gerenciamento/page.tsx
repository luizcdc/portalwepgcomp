"use client";

import Banner from "@/components/UI/Banner";
import Gerenciar from "@/components/GerenciarUsuario/Gerenciar";
import { useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";

export default function Gerenciamento() {
  const { getUsers } = useUsers();

  useEffect(() => {
    getUsers({});
  }, []);

  return (
    <div
      className="d-flex flex-column"
      style={{
        gap: "30px",
      }}
    >
      <Banner title="Gerenciamento de Usuários" />
      <Gerenciar />
    </div>
  );
}
