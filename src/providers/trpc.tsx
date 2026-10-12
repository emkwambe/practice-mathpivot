import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient();

function TRPCClientProvider({ children }: { children: ReactNode }) {
  const { getToken, userId } = useAuth();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        transformer: superjson,
        headers: async () => {
          const token = await getToken();
          return {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(userId ? { "x-clerk-user-id": userId } : {}),
          };
        },
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <TRPCClientProvider>
      {children}
    </TRPCClientProvider>
  );
}
