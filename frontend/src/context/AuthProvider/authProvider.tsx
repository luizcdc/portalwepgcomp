"use client";

import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { UserLogin } from "@/models/user";
import {
  api,
  getUserLocalStorage,
  LoginRequest,
  setTokenLocaStorage,
} from "./util";

export const AuthContext = createContext<IContextLogin>({} as IContextLogin);

interface IContextLogin {
  user: string | null;
  userId: UUID | null;
  signed: boolean;
  singIn: (body: UserLogin) => Promise<void>;
  logout: () => void;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<null | string>(null);
  const [userId, setUserId] = useState<null | UUID>(null);
  const { showAlert } = useSweetAlert();
  const router = useRouter();

  useEffect(() => {
    const user = getUserLocalStorage();

    if (user) {
      setUser(user);
    }
  }, []);

  const singIn = async ({ email, password }: UserLogin) => {
    try {
      const response = await LoginRequest(email, password);
      const payload = response.token;
      const userId = response.data.id;

      setUser(payload);
      setUserId(userId);

      api.defaults.headers.common["Authorization"] = `Bearer ${payload}`;
      setTokenLocaStorage(payload);

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
    setUserId(null);
    return router.push("/");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        signed: !!user,
        singIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
