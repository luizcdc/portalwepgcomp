"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "./user";
import { SessionProvider } from "./session";
import { EdicaoProvider } from "./edicao";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ComposeProviders with={[UserProvider, SessionProvider, EdicaoProvider]}>
      {children}
    </ComposeProviders>
  );
};

export default Providers;
