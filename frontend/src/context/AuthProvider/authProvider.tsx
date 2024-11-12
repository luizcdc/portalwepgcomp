import { createContext, useEffect, useState } from "react";
import { IContext, IAuthProvider, IUser } from "./types";
import { getUserLocalStorage, LoginRequest, setUserLocalStorage } from "./util";

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider = ({ children }: IAuthProvider) => {
    const [user, setUser] = useState<IUser | null>();

    useEffect(() => {
        const user = getUserLocalStorage();

        if(user){
            setUser(user);
        }
    }, [])

    async function authenticate(email: string, password: string){
        console.log("Auth : ", email, password)
        const response = await LoginRequest(email, password);
        
        const payload = {token: response.token, email};
        setUser(payload);
        setUserLocalStorage(payload)
    }

    function logout(){
        setUser(null);
        setUserLocalStorage(null);
    }

    return(
        <AuthContext.Provider value={{...user, authenticate, logout }}>
            {children}
        </AuthContext.Provider>
    )
}