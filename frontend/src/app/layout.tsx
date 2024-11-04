import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapClient from "@/components/BootstrapClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import Providers from "@/context";

export const metadata: Metadata = {
  title: "WEPGCOMP 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{display: "flex", flexDirection: "column", height: '100vh'}}>
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
