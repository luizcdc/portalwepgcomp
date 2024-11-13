"use client"
import { createContext, useEffect, useState } from "react";
import { getUserLocalStorage, instance, LoginRequest, setTokenLocaStorage } from "./util";
import { useRouter } from "next/navigation";

export const AuthContext = createContext< IContextLogin>( {} as IContextLogin);

interface IContextLogin{
    user: string | null,
    signed: boolean,
    singIn: (body: UserLogin) => Promise<void>, 
    logout: () => void
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<null | string>(null);
    const router = useRouter();

    useEffect(() => {
        const user = getUserLocalStorage();

        if(user){
            setUser(user);
        }
    }, [])

    const singIn = async ({email, password}) => {
        const response = await LoginRequest(email, password);

        if(!response || response.data.error){
            alert(response?.data.error || "Error");
        } else {             
            const payload = response.data;
            setUser(payload);
            instance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${payload.token}`;
            setTokenLocaStorage(payload.token);
        }    
    }

    function logout(){
        localStorage.clear();
        setUser(null); 
        return router.push("/");  
    }

    return(
        <AuthContext.Provider 
        value={{
            user,
            signed: !!user,
            singIn, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    )
}