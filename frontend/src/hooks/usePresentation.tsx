import { PresentationContext } from "@/context/presentation";
import { useContext } from "react";

export const usePresentation = () => useContext(PresentationContext);