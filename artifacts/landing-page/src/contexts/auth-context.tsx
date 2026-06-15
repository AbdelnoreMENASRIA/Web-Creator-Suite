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

// Determine API base URL with proper fallback chain
// 1. Use VITE_API_URL from build environment (Render injects this)
// 2. Fallback to production Render URL
// 3. Fallback to localhost for development
const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is defined and not empty, use it
  if (envUrl && envUrl.trim()) {
    return envUrl;
  }
  
  // Production fallback
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://teach-in-english-api.onrender.com";
  }
  
  // Development fallback
  return "http://localhost:10000";
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
