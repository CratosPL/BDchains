// src/app/_app.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Opcjonalne devtools
import { useState } from "react";
import "../styles/globals.css"; // Jeśli masz globalne style

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minut - dane są "świeże" przez 5 minut
      cacheTime: 30 * 60 * 1000, // 30 minut - dane są trzymane w cache przez 30 minut
      refetchOnWindowFocus: false, // Nie odświeżaj przy fokusie okna
    },
  },
});

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} /> {/* Opcjonalne - narzędzie do debugowania */}
    </QueryClientProvider>
  );
}