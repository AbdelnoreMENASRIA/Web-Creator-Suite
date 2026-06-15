import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthUser {
  id: string;
  role: "apprenant" | "formateur";
  prenom: string;
  nom: string;
  age: number;
  numero: string;
  typeCompte: "doctorant" | "enseignant";
  universite: string;
  faculte: string;
  departement: string;
  email: string;
  specialite: string;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hardcoded production URL to ensure it always works
const PRODUCTION_API_URL = "https://teach-in-english-api.onrender.com";

// Determine API base URL - use production URL for any non-localhost environment
const getApiBase = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isDevelopment =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    if (isDevelopment) {
      return "http://localhost:10000";
    }
  }

  // Default to production URL
  return PRODUCTION_API_URL;
};

const API_BASE = getApiBase();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("tie_token"));

  const refreshUser = async () => {
    const t = localStorage.getItem("tie_token");
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
      logout();
    }
  };

  useEffect(() => {
    if (token) refreshUser();
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem("tie_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("tie_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
