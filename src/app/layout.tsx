"use client";

import { MantineProvider } from "@mantine/core";
import { Russo_One, Unbounded } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const russo = Russo_One({ subsets: ["latin"], weight: "400", variable: "--font-russo" });
const unbounded = Unbounded({ subsets: ["latin"], weight: "200", variable: "--font-unbounded" });

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${russo.variable} ${unbounded.variable}`}>
      <body className="font-russo">
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            theme={{
              colors: {
                gray: [
                  "#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#ced4da",
                  "#adb5bd", "#868e96", "#495057", "#343a40", "#111827",
                ],
                red: [
                  "#ffe3e3", "#ffc1cc", "#ffa8b7", "#ff8fa3", "#ff758f",
                  "#ff5c7b", "#ff4266", "#ff2952", "#ff0f3d", "#b71c1c",
                ],
              },
              primaryColor: "red",
              fontFamily: "'Russo One', sans-serif",
              headings: { fontFamily: "'Unbounded', sans-serif" },
              components: {
                Button: {
                  styles: {
                    root: {
                      color: "#d0d0d0 !important",
                      "&:disabled": {
                        color: "#d0d0d0 !important",
                        opacity: 0.6,
                      },
                    },
                  },
                },
              },
            }}
          >
            {children} {/* Usunięto Suspense */}
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}