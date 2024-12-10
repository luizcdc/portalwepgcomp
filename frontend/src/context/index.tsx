"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "./user";
import { SessionProvider } from "./session";
import { EvaluationProvider } from "./evaluation";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ComposeProviders with={[UserProvider, SessionProvider, EvaluationProvider]}>
      {children}
    </ComposeProviders>
  );
};

export default Providers;
