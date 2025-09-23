import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { authClient } from "@/api/auth";

const AuthContext = createContext(authClient);

export function AuthProvider({ children }: PropsWithChildren) {
  const value = useMemo(() => authClient, []);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        <AuthUIProviderTanstack authClient={value}>
          {children}
        </AuthUIProviderTanstack>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
