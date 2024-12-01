"use client";
"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import {
  api,
  getUserLocalStorage,
  LoginRequest,
  setTokenLocaStorage,
} from "./util";

export const AuthContext = createContext<IContextLogin>({} as IContextLogin);
export const AuthContext = createContext<IContextLogin>({} as IContextLogin);

interface IContextLogin {
  user: string | null;
  signed: boolean;
  singIn: (body: UserLogin) => Promise<void>;
  logout: () => void;
interface IContextLogin {
  user: string | null;
  signed: boolean;
  singIn: (body: UserLogin) => Promise<void>;
  logout: () => void;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<null | string>(null);
  const { showAlert } = useSweetAlert();
  const router = useRouter();

  useEffect(() => {
    const user = getUserLocalStorage();
  useEffect(() => {
    const user = getUserLocalStorage();

    if (user) {
      setUser(user);
    }
  }, []);
    if (user) {
      setUser(user);
    }
  }, []);

  const singIn = async ({ email, password }) => {
    try {
      const response = await LoginRequest(email, password);
      const payload = response.token;

      setUser(payload);
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
        text: err.response?.data?.message || "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde!",
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
