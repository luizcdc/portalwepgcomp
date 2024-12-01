"use client";

import { createContext, useEffect, useState } from "react";
import {
  getUserLocalStorage,
  api,
  LoginRequest,
  setTokenLocaStorage,
} from "./util";
import { useRouter } from "next/navigation";
import { UserLogin } from "@/models/user";

export const AuthContext = createContext<IContextLogin>({} as IContextLogin);

interface IContextLogin {
  user: string | null;
  signed: boolean;
  singIn: (body: UserLogin) => Promise<void>;
  logout: () => void;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<null | string>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getUserLocalStorage();

    if (user) {
      setUser(user);
    }
  }, []);

  const singIn = async ({ email, password }) => {
    const response = await LoginRequest(email, password);

    if (!response) {
      alert(response || "Error");
    } else {
      const payload = response.token;
      setUser(payload);
      api.defaults.headers.common["Authorization"] = `Bearer ${payload}`;
      setTokenLocaStorage(payload);
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
