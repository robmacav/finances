import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../services/auth";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // tenta recuperar sessão ao carregar
  useEffect(() => {
    (async () => {
      if (auth.token) {
        try {
          const me = await auth.me();
          setUser(me);
        } catch {
          auth.logout();
        }
      }
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        await auth.login(email, password);
        const me = await auth.me();
        setUser(me);
        return me;
      },
      logout: () => {
        auth.logout();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
