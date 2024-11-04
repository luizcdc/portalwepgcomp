
"use client"
import { userApi } from '@/services/user';
import { createContext, ReactNode, useState } from 'react';

interface UserProps {
    children: ReactNode;
  }
  
interface UserProviderData {
    loadingCreateUser: boolean,
    user: User | null;
    registerUser: (body: RegisterUserParams) => Promise<void>;
}

export const UserContext = createContext<UserProviderData>({} as UserProviderData);

export const UserProvider = ({ children }: UserProps) => {
    const [loadingCreateUser, setLoadingCreateUser] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const registerUser = async (body: RegisterUserParams) => {
        setLoadingCreateUser(true);
        userApi
          .registerUser(body)
          .then(response => {
            setUser(response);
            console.log("criado");
          })
          .catch(err => {
            console.log(err);
            setUser(null);
            console.log("erro ao criar")
        })
          .finally(() => {
            setLoadingCreateUser(false)
          });
      };

    return (
        <UserContext.Provider
          value={{
            loadingCreateUser,
            user,
            registerUser,
          }}
        >
          {children}
        </UserContext.Provider>
      );
}