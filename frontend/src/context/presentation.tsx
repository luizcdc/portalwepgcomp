import { BookmarkedPresentations } from "@/models/presentatio-bookmarks";
import { presentationApi } from "@/services/presentation";
import { createContext, ReactNode, useState } from "react";

interface PresentationProps {
  children: ReactNode;
}

interface PresentationProviderData {
    presentationList: Presentation[];
    presentationBookmark: PresentationBookmark;
    presentationBookmarks: BookmarkedPresentations;
    getPresentationAll: (eventEditionId: string) => void;
    getPresentationBookmark: (presentationBookmark: PresentationBookmarkRegister) => Promise<any>;
    getPresentationBookmarks: () => Promise<PresentationBookmark>;
    postPresentationBookmark: (presentationBookmark: PresentationBookmarkRegister) => void;
    deletePresentationBookmark: (presentationBookmark: PresentationBookmarkRegister) => void;
}

export const PresentationContext = createContext<PresentationProviderData>(
  {} as PresentationProviderData
);

export const PresentationProvider = ({ children }: PresentationProps) => {
    const [presentationList, setpresentationList] = useState<Presentation[]>([]);
    const [presentationBookmark, setpresentationBookmark] = useState<PresentationBookmark>({ bookmarked: false });
    const [presentationBookmarks, setPresentationbookmarks] = useState<BookmarkedPresentations>({
      bookmarkedPresentations: [],
    });

    

  const getPresentationAll = async (eventEditionId: string) => {
    presentationApi
      .getPresentations(eventEditionId)
      .then((response) => {
        setpresentationList(response);
      })
      .catch(() => {
        setpresentationList([]);
      })
      .finally(() => {});
  };

  const getPresentationBookmark = async (
    presentationBookmark: PresentationBookmarkRegister
  ) => {
    return presentationApi
      .getPresentationBookmark(presentationBookmark)
      .then((response) => {
        setpresentationBookmark(response);
        return response;
      })
      .catch(() => {
        setpresentationBookmark({ bookmarked: false });
        return { bookmarked: false };
      })
      .finally(() => {});
  };

    const getPresentationBookmarks = async () => {
        return presentationApi.getPresentationBookmarks()
            .then((response) => {
                setPresentationbookmarks(response);
                return response;
            })
            .catch(() => {
                setpresentationBookmark({ bookmarked: false });
                return { bookmarked: false };
            })
            .finally(() => {});
    }

    const postPresentationBookmark = async (presentationBookmark: PresentationBookmarkRegister) => {
        presentationApi.postPresentationBookmark(presentationBookmark)
            .finally(() => {});
    }

  const deletePresentationBookmark = async (
    presentationBookmark: PresentationBookmarkRegister
  ) => {
    presentationApi
      .deletePresentationBookmark(presentationBookmark)
      .finally(() => {});
  };

    return(
        <PresentationContext.Provider
            value={{
                presentationList,
                presentationBookmark,
                presentationBookmarks,
                getPresentationAll,
                postPresentationBookmark,
                deletePresentationBookmark,
                getPresentationBookmark,
                getPresentationBookmarks
            }}
        >
            {children}
        </PresentationContext.Provider>
    )
}
