"use client";
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "./user";
import { SessionProvider } from "./session";
import { CommitterProvider } from "./commiteeMember";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ComposeProviders with={[UserProvider, SessionProvider, CommitterProvider]}>
      {children}
    </ComposeProviders>
  );
};

export default Providers;
