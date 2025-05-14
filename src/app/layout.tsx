import type { Metadata } from "next";
import "./globals.css";
import { WalletContextProvider } from "./components/WalletProvider";

export const metadata: Metadata = {
  title: "DriveChain",
  description: "DriveChain is a blockchain-based platform for buying and selling used electric vehicles with full transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
