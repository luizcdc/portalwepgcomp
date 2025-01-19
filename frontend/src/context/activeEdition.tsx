import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface ActiveEditionProps {
  children: ReactNode;
}

interface ActiveEditionProviderData {
  selectEdition: {
    year: string;
    isActive: boolean;
  };
  setSelectEdition: Dispatch<
    SetStateAction<{
      year: string;
      isActive: boolean;
    }>
  >;
  loadingActiveEdition: boolean;
  setLoadingActiveEdition: Dispatch<SetStateAction<boolean>>;
}

export const ActiveEditionContext = createContext<ActiveEditionProviderData>(
  {} as ActiveEditionProviderData
);

export const ActiveEditionProvider = ({ children }: ActiveEditionProps) => {
  const [selectEdition, setSelectEdition] = useState<{
    year: string;
    isActive: boolean;
  }>({ year: "", isActive: false });
  const [loadingActiveEdition, setLoadingActiveEdition] =
    useState<boolean>(false);

  return (
    <ActiveEditionContext.Provider
      value={{
        selectEdition,
        setSelectEdition,
        loadingActiveEdition,
        setLoadingActiveEdition,
      }}
    >
      {children}
    </ActiveEditionContext.Provider>
  );
};
