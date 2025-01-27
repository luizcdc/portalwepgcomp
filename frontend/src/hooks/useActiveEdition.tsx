import { ActiveEditionContext } from "@/context/activeEdition";
import { useContext } from "react";

export const useActiveEdition = () => {
  return useContext(ActiveEditionContext);
};
