"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { userApi } from "@/services/user";
import { createContext, ReactNode, useState } from "react";

import { useRouter } from "next/navigation";

interface UserProps {
  children: ReactNode;
}

interface UserProviderData {
  loadingCreateUser: boolean;
  loadingSendEmail: boolean;
  loadingResetPassword: boolean;
  user: User | null;
  registerUser: (body: RegisterUserParams) => Promise<void>;
  resetPasswordSendEmail: (body: ResetPasswordSendEmailParams) => Promise<void>;
  resetPassword: (body: ResetPasswordParams) => Promise<void>;
}

export const UserContext = createContext<UserProviderData>(
  {} as UserProviderData
);

export const UserProvider = ({ children }: UserProps) => {
  const [loadingCreateUser, setLoadingCreateUser] = useState<boolean>(false);
  const [loadingSendEmail, setLoadingSendEmail] = useState<boolean>(false);
  const [loadingResetPassword, setLoadingResetPassword] =
    useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const registerUser = async (body: RegisterUserParams) => {
    setLoadingCreateUser(true);
    userApi
      .registerUser(body)
      .then((response) => {
        setUser(response);
        console.log("criado");
        router.push("/Login");
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
        console.log("erro ao criar");
      })
      .finally(() => {
        setLoadingCreateUser(false);
      });
  };

  const resetPasswordSendEmail = async (body: ResetPasswordSendEmailParams) => {
    setLoadingSendEmail(true);
    userApi
      .resetPasswordSendEmail(body)
      .then((response) => {
        setUser(response);
        console.log("Email enviado");
        router.push("/Login");
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
        console.log("erro ao enviar");
      })
      .finally(() => {
        setLoadingSendEmail(false);
      });
  };

  const resetPassword = async (body: ResetPasswordParams) => {
    setLoadingResetPassword(true);
    userApi
      .resetPassword(body)
      .then((response) => {
        setUser(response);
        console.log("Senha alterada");
        router.push("/Login");
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
        console.log("erro ao enviar");
      })
      .finally(() => {
        setLoadingResetPassword(false);
      });
  };

  return (
    <UserContext.Provider
      value={{
        loadingCreateUser,
        loadingSendEmail,
        loadingResetPassword,
        user,
        registerUser,
        resetPasswordSendEmail,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
