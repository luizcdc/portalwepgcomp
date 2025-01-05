"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState } from "react";

import { useSweetAlert } from "@/hooks/useAlert";
import { userApi } from "@/services/user";

interface UserProps {
  children: ReactNode;
}

interface UserProviderData {
  loadingCreateUser: boolean;
  loadingSendEmail: boolean;
  loadingResetPassword: boolean;
  loadingUserList: boolean;
  loadingAdvisors: boolean;
  user: User | null;
  userList: User[];
  advisors: User[];
  getUsers: (params: GetUserParams) => void;
  registerUser: (body: RegisterUserParams) => Promise<void>;
  resetPasswordSendEmail: (body: ResetPasswordSendEmailParams) => Promise<void>;
  resetPassword: (body: ResetPasswordParams) => Promise<void>;
  getAdvisors: () => Promise<void>;
}

export const UserContext = createContext<UserProviderData>(
  {} as UserProviderData
);

export const UserProvider = ({ children }: UserProps) => {
  const [loadingCreateUser, setLoadingCreateUser] = useState<boolean>(false);
  const [loadingUserList, setLoadingUserList] = useState<boolean>(false);
  const [loadingSendEmail, setLoadingSendEmail] = useState<boolean>(false);
  const [loadingResetPassword, setLoadingResetPassword] =
    useState<boolean>(false);
  const [loadingAdvisors, setLoadingAdvisors] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [advisors, setAdvisors] = useState<User[]>([]);

  const { showAlert } = useSweetAlert();
  const router = useRouter();

  const getUsers = async (params: GetUserParams) => {
    setLoadingUserList(true);

    try {
      const response = await userApi.getUsers(params);
      setUserList(response);
      console.log("Listado com sucesso");
    } catch (err: any) {
      setUserList([]);

      showAlert({
        icon: "error",
        title: "Erro ao listar usuários",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro durante a busca.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingUserList(false);
    }
  };

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

      router.push("/login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao cadastrar usuário",
        text:
          err.response?.data?.message?.message ||
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

      router.push("/login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao enviar e-mail",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao enviar o e-mail.",
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

      router.push("/login");
    } catch (err: any) {
      setUser(null);

      showAlert({
        icon: "error",
        title: "Erro ao alterar senha",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao tentar alterar sua senha. Tente novamente!",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingResetPassword(false);
    }
  };

  const getAdvisors = async () => {
    setLoadingAdvisors(true);

    try {
      const response = await userApi.getAdvisors();
      setAdvisors(response);
    } catch (err: any) {
      console.error(err);
      setAdvisors([]);

      showAlert({
        icon: "error",
        title: "Erro ao buscar orientadores",
        text:
          err.response?.data?.message?.message ||
          err.response?.data?.message ||
          "Ocorreu um erro ao buscar orientadores.",
        confirmButtonText: "Retornar",
      });
    } finally {
      setLoadingAdvisors(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loadingCreateUser,
        loadingSendEmail,
        loadingResetPassword,
        loadingUserList,
        loadingAdvisors,
        user,
        userList,
        advisors,
        getUsers,
        registerUser,
        resetPasswordSendEmail,
        resetPassword,
        getAdvisors,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
