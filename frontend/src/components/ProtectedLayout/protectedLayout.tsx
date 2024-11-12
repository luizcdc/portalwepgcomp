import React from "react";
import { useAuth } from "@/hooks/useAuth"

export const ProtectedLayout = ({ children }: { children:  React.ReactNode}) => {
    const auth = useAuth();
    
    if(!auth.email){
        return <h1>Você não possui acesso!</h1>;
    }

    return children;
}