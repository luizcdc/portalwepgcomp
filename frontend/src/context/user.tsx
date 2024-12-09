"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { RegisterUserParams, ResetPasswordParams, ResetPasswordSendEmailParams, User } from "@/models/user";
import { userApi } from "@/services/user";

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

  const { showAlert } = useSweetAlert();
  const router = useRouter();

  const registerUser = async (body: RegisterUserParams) => {
    setLoadingCreateUser(true);

    try {
      const response = await userApi.registerUser(body);
      setUser(response);

      showAlert({
        icon: "success",
        title: "Cadastro realizado com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });

      router.push("/Login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao cadastrar usuário",
        text:
          err.response?.data?.message ||
          "Ocorreu um erro durante o cadastro. Tente novamente mais tarde!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingCreateUser(false);
    }
  };

  const resetPasswordSendEmail = async (body: ResetPasswordSendEmailParams) => {
    setLoadingSendEmail(true);

    try {
      const response = await userApi.resetPasswordSendEmail(body);
      setUser(response);

      showAlert({
        icon: "success",
        title: "E-mail enviado com sucesso!",
        text: "Confira o e-mail cadastrado para redefinir a senha.",
        timer: 3000,
        showConfirmButton: false,
      });

      router.push("/Login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao enviar e-mail",
        text:
          err.response?.data?.message || "Ocorreu um erro ao enviar o e-mail.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingSendEmail(false);
    }
  };

  const resetPassword = async (body: ResetPasswordParams) => {
    setLoadingResetPassword(true);

    try {
      const response = await userApi.resetPassword(body);
      setUser(response);

      showAlert({
        icon: "success",
        title: "Senha alterada com sucesso!",
        timer: 3000,
        showConfirmButton: false,
      });

      router.push("/Login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao alterar senha",
        text:
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar alterar sua senha. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingResetPassword(false);
    }
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
