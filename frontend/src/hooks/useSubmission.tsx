import { SubmissionContext } from "@/context/submission";
import { useContext } from "react";

export const useSubmission = () => useContext(SubmissionContext);
