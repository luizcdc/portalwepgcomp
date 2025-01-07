import axiosInstance from "@/utils/api";

export const api = axiosInstance;
 
export function setTokenLocalStorage(token: any){
    localStorage.setItem("@Auth:token", token)
}

export function setUserLocalStorage(user: UserProfile) {
  const userString = JSON.stringify(user);
  localStorage.setItem("@Auth:user", userString);
}

export function setEventEditionIdStorage(eventEditionId: string) {
  localStorage.setItem("@Session:eventEditionId", eventEditionId);
}

export function getTokenLocalStorage() {
  const storageToken = localStorage.getItem("@Auth:token");

  if (storageToken) {
    return storageToken;
  }
  return null;
}

export function getUserLocalStorage() {
  const storageUser = localStorage.getItem("@Auth:user");

  if (storageUser) {
    return storageUser;
  }
  return null;
}

export function getEventEditionIdStorage() {
  const eventEditionId = localStorage.getItem("@Session:eventEditionId");

  if (eventEditionId) {
    return eventEditionId;
  }
  return null;
}

export function logout() {
  localStorage.clear();
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
