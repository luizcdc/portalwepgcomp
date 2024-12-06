import { axiosInstance } from "@/utils/api";

export const api = axiosInstance();
 
export function setTokenLocalStorage(token: any){
    localStorage.setItem("@Auth:token", token)
}

export function getUserLocalStorage() {
  const storageToken = localStorage.getItem("@Auth:token");

  if (storageToken) {
    return storageToken;
  }
  return null;
}

export async function LoginRequest(
  email: string,
  password: string
): Promise<{
  token: string; data: UserProfile 
}> {


  const { data } = await api.post("auth/login", { email, password });

  return data;
}
