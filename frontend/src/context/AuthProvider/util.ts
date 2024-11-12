import { axiosInstance } from "@/utils/api";
import { IUser } from "./types";


export function setUserLocalStorage(user: IUser | null){
    localStorage.setItem("u", JSON.stringify(user));
}

export function getUserLocalStorage(){
    const json = localStorage.getItem('u');
    
    if(!json){
        return null;
    }

    const user = JSON.parse(json);

    return user ?? null;
}

export async function LoginRequest (email: string, password: string){
    try {
        console.log("Cheguei na requisição")
        const instance = axiosInstance();
        const request = await instance.post('login', { email, password })

        return request.data;
    } catch (error) {
        console.log("Erro: ", error)
        return null ;
    }
}