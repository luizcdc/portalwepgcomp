import { axiosInstance } from "@/utils/api";

export const api = axiosInstance();

export function setTokenLocaStorage(token: any) {
  localStorage.setItem("@Auth:token", token);
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
): Promise<{ token: string }> {

  const instance = axiosInstance();

  const { data } = await instance.post("auth/login", { email, password });

  return data;
}
