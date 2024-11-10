/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

export default function usePost() {
  const [error, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function cadastrarDados<T>({ url, dados }: { url: string; dados: T }) {
    try {
      await fetch(`http://localhost:3000/${url}`, {
        method: "POST",
        body: JSON.stringify(dados),
      });
      setSucesso(true);
    } catch (error) {
      setErro("Não foi possivel enviar os dados");
    }
  }
  return { cadastrarDados, sucesso, error };
}
