import { committerMembersApi } from "@/services/CommitteeMember";
import { createContext, ReactNode, useState } from "react";

interface CommitterProps {
    children: ReactNode;
  }

interface CommitterProviderData {
    committerList: Committer[];
    getCommitterAll: () => void;
}
  

export const CommitteerContext = createContext<CommitterProviderData>(
    {} as CommitterProviderData
);

export const CommitterProvider = ({ children }: CommitterProps) => {
    const [committerList, setcommitterList] = useState<Committer[]>([]);

    const getCommitterAll = async () => {
        committerMembersApi.getAllMembers()
        .then((response) => {
            setcommitterList(response);
        })
        .catch((err) => {
            console.log(err)
            setcommitterList([]);
            console.log("erro ao obter os membros da comissão")
        })
        .finally(() => {});
    }

    return(
        <CommitteerContext.Provider
            value={{
                committerList,
                getCommitterAll
            }}
        >
            {children}
        </CommitteerContext.Provider>
    )
}