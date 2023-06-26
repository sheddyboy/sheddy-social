"use client";
import AppContextProvider from "@/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          {children}
          <ReactQueryDevtools />
        </AppContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
