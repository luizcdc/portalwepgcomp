import { SessionContext } from "@/context/session";
import { useContext } from "react";

export const useSession = () => useContext(SessionContext);
