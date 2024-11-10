"use client"
import { ComposeProviders } from "@/components/ComposeProviders";
import { UserProvider } from "./user";


interface ProvidersProps {
    children: React.ReactNode;
  }
  
  const Providers = ({ children }: ProvidersProps) => {
    return (
      <ComposeProviders
        with={[
            UserProvider,
        ]}
      >
        {children}
      </ComposeProviders>
    );
  };
  
  export default Providers;