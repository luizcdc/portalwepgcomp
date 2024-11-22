import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider/authProvider";
import "./protectedLayout.css";

export const ProtectedLayout = ({ children }: { children:  React.ReactNode}) => {
    const {signed} = useContext(AuthContext);

    
    if(!signed){
        return <h1>Você não possui acesso!<p>Para acessar esta página, entre com sua conta em Login</p></h1>;
    }

    return children;
}