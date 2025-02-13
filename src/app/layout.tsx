"use client";
import { Russo_One, Unbounded } from 'next/font/google';
import './globals.css';
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pobieranie czcionek z Next.js
const russo = Russo_One({ subsets: ['latin'], weight: '400', variable: '--font-russo' });
const unbounded = Unbounded({ subsets: ['latin'], weight: '200', variable: '--font-unbounded' });

const treasuryConfig = {
  treasury: "xion1vrrvcqcupu87kfpu8sehe93yzf0fp77rc8hfxs3fqjwjfdf9nynqa5vunu",
};

// Utwórz instancję QueryClient
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${russo.variable} ${unbounded.variable}`}>
      <body className="font-russo">
        <QueryClientProvider client={queryClient}>
          <AbstraxionProvider config={treasuryConfig}>
            {children}
          </AbstraxionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}