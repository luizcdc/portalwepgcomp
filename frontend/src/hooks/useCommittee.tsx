import { CommitteerContext } from "@/context/commiteeMember";
import { useContext } from "react";

export const useCommittee = () => useContext(CommitteerContext);