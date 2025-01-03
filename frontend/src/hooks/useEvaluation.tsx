import { EvaluationContext } from "@/context/evaluation";
import { useContext } from "react";

export const useEvaluation = () => useContext(EvaluationContext);