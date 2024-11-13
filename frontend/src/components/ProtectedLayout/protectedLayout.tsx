import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";

export const ProtectedLayout = ({ children }: { children:  React.ReactNode}) => {
    const {signed} = useContext(AuthContext);

    
    if(!signed){
        return <h1>Você não possui acesso!</h1>;
    }

    return children;
}