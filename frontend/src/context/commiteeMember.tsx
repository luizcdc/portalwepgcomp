import { committerMembersApi } from "@/services/CommitteeMember";
import { createContext, ReactNode, useState } from "react";

interface CommitterProps {
  children: ReactNode;
}

interface CommitterProviderData {
  committerList: Committer[];
  getCommitterAll: (eventEditionId?: string) => void;
}

export const CommitteerContext = createContext<CommitterProviderData>(
  {} as CommitterProviderData
);

export const CommitterProvider = ({ children }: CommitterProps) => {
  const [committerList, setcommitterList] = useState<Committer[]>([]);

  const getCommitterAll = async (eventEditionId?: string) => {
    committerMembersApi
      .getAllMembers(eventEditionId ?? "")
      .then((response) => {
        setcommitterList(response);
      })
      .catch(() => {
        setcommitterList([]);
      })
      .finally(() => {});
  };

  return (
    <CommitteerContext.Provider
      value={{
        committerList,
        getCommitterAll,
      }}
    >
      {children}
    </CommitteerContext.Provider>
  );
};
