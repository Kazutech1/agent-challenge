import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DeFi Agent | Solana Intelligence",
  description: "On-chain Solana DeFi intelligence powered by ElizaOS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

 