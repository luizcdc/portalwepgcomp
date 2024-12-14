import { committerMembersApi } from "@/services/CommitteeMember";
import { Presentation, presentationApi } from "@/services/presentation";
import { createContext, ReactNode, useState } from "react";

interface PresentationProps {
    children: ReactNode;
}

interface PresentationProviderData {
    presentationList: Presentation[];
    getPresentationAll: (eventEditionId: string) => void;
}
  

export const PresentationContext = createContext<PresentationProviderData>(
    {} as PresentationProviderData
);

export const PresentationProvider = ({ children }: PresentationProps) => {
    const [presentationList, setpresentationList] = useState<Presentation[]>([]);

    const getPresentationAll = async (eventEditionId: string) => {
        presentationApi.getPresentations(eventEditionId)
            .then((response) => {
                setpresentationList(response);
            })
            .catch(() => {
                setpresentationList([]);
            })
            .finally(() => {});
    }

    return(
        <PresentationContext.Provider
            value={{
                presentationList,
                getPresentationAll
            }}
        >
            {children}
        </PresentationContext.Provider>
    )
}