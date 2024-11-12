/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

export default function usePost() {
  const [error, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [response, setResponse] = useState('');

  async function cadastrarDados<T>({ url, dados }: { url: string; dados: T }) {
    try {
      const response = await fetch(`https://reqres.in/api/`, {
        method: "POST",
        body: JSON.stringify(dados),
      });
      setSucesso(true);
      const responseConvertida = await response.json();
      setResponse(responseConvertida.token);
    } catch (error) {
      setErro("Não foi possivel enviar os dados");
    }
  }
  return { cadastrarDados, sucesso, error, response };
}
