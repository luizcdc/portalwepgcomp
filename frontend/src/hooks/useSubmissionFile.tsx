import { SubmissionFileContext } from '@/context/submissionFile';
import { useContext } from "react";

export const useSubmissionFile = () => useContext(SubmissionFileContext);
