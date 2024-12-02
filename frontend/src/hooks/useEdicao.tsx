import { EdicaoContext } from "@/context/edicao";
import { useContext } from "react";

export const useEdicao = () => useContext(EdicaoContext);
