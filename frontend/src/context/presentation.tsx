import { presentationsApi } from "@/services/presentatios";
import { createContext, ReactNode, useState } from "react";


interface PresentationProps {
    children: ReactNode;
}

interface PresentationsProviderData {
    presentationBookmarkList: any[];
    setPresentationFavorite: (body:any) => void;
}

export const PresentationContext = createContext<PresentationsProviderData>(
    {} as PresentationsProviderData
);

export const PresentationProvider = ({ children }: PresentationProps) => {
    const [presentationBookmarkList, setPresentationBookmarkList] = useState<any[]>([]);
    
    const setPresentationFavorite = async (body: any) => {
        presentationsApi.postPresentationBookmark(body)
        .then((response) => {
            setPresentationBookmarkList(response);
        })
        .catch(() => {
            setPresentationBookmarkList([]);
        })
        .finally(() => {})
    }

    return(
        <PresentationContext.Provider
            value = {{
                presentationBookmarkList,
                setPresentationFavorite
            }}
        >
            {children}
        </PresentationContext.Provider>
    )
}