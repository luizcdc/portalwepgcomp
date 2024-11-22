import { axiosInstance } from "@/utils/api";


export const api = axiosInstance();
 
export function setTokenLocaStorage(token: any){
    localStorage.setItem("@Auth:token", token)
}

export function getUserLocalStorage(){
    const storageToken = localStorage.getItem('@Auth:token');
    
    if(storageToken){
       return storageToken;
    }
    return  null;
}

export async function LoginRequest (email: string, password: string): Promise<{ token: string }>{
    try {
        const response = await api.post('auth/login', { email, password });
        return { token: response.data.token };
    } catch (error: any) {
        const message = error || "Login ou senha invalida!";
        return message;
    }
}