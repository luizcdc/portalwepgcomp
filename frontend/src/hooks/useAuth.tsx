import { AuthContext } from "../context/AuthProvider/authProvider"
import { useContext } from "react"

export const useAuth = () => {
    return useContext(AuthContext);
}
