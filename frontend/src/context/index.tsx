"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "./user";
import { SessionProvider } from "./session";
import { OrientacaoProvider } from "./orientacoes";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ComposeProviders
      with={[UserProvider, SessionProvider, OrientacaoProvider]}
    >
      {children}
    </ComposeProviders>
  );
};

export default Providers;
