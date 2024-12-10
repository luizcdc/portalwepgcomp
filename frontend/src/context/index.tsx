"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "./user";
import { SessionProvider } from "./session";
import { EvaluationProvider } from "./evaluation";
import { EdicaoProvider } from "./edicao";
import { OrientacaoProvider } from "./orientacoes";
import { CommitterProvider } from "./commiteeMember";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ComposeProviders
      with={[
        UserProvider,
        SessionProvider,
        EdicaoProvider, 
        EvaluationProvider,
        CommitterProvider,
        OrientacaoProvider,
      ]}
    >
      {children}
    </ComposeProviders>
  );
};

export default Providers;
