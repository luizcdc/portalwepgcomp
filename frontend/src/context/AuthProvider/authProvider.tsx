"use client";

import { useRouter } from "next/navigation";
import { createContext, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { UserLogin, UserProfile } from "@/models/user";
import { api, LoginRequest, setTokenLocalStorage } from "./util";

export const AuthContext = createContext<IContextLogin>({} as IContextLogin);

interface IContextLogin {
  user: UserProfile | null;
  signed: boolean;
  singIn: (body: UserLogin) => Promise<void>;
  logout: () => void;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<null | UserProfile>(null);
  const { showAlert } = useSweetAlert();
  const router = useRouter();

  const singIn = async ({ email, password }) => {
    try {
      const response = await LoginRequest(email, password);
      const payload = {
        token: response.token,
        data: response.data,
      };

      setUser(payload.data);
      api.defaults.headers.common["Authorization"] = `Bearer ${payload.token}`;
      setTokenLocalStorage(payload.token);

      showAlert({
        icon: "success",
        title: "Login realizado com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        text:
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    }
  };

  function logout() {
    localStorage.clear();
    setUser(null);
    return router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signed: !!user,
        singIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
