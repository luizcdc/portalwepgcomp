import BootstrapClient from "@/components/BootstrapClient";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Providers from "@/context";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEPGCOMP 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Providers>
          <div className="d-flex flex-column vh-100">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
      <BootstrapClient />
    </html>
  );
}
