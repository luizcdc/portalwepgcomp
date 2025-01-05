"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "./user";
import { SessionProvider } from "./session";
import { EvaluationProvider } from "./evaluation";
import { OrientacaoProvider } from "./orientacoes";
import { CommitterProvider } from "./commiteeMember";
import { EdicaoProvider } from "./edicao";
import { PresentationProvider } from "./presentation";
import { SubmissionProvider } from "./submission";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ComposeProviders
      with={[
        UserProvider,
        SessionProvider,
        EvaluationProvider,
        EdicaoProvider,
        PresentationProvider,
        CommitterProvider,
        OrientacaoProvider,
        SubmissionProvider,
      ]}
    >
      {children}
    </ComposeProviders>
  );
};

export default Providers;
