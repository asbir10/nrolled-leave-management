import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loginUser, type User } from "@/lib/api";
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "nrolled.user";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const u = await loginUser(email, password);
      console.log("[AuthContext.login] success:", u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      setUser(u);
      return u;
    } catch (err: any) {
      console.error("[AuthContext.login] caught error:", err);
      throw err;
    }
  };
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}