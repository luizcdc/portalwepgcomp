"use client";

import { createContext, useEffect, useState } from "react";
import {
  getUserLocalStorage,
  api,
  LoginRequest,
  setTokenLocaStorage,
} from "./util";
import { useRouter } from "next/navigation";

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
    await LoginRequest(email, password)
      .then((response) => {
        const payload = response.token;
        setUser(payload);
        api.defaults.headers.common["Authorization"] = `Bearer ${payload}`;
        setTokenLocaStorage(payload);
      })
      .catch((err) => {
        setUser(null);

        alert(err.response.data.message);
      });
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
