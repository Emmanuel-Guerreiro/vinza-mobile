import { login, register } from "@/modules/auth/api";
import {
  LoginRequest,
  RegisterRequest,
  UserLogged,
} from "@/modules/auth/types";
import { createContext, useContext, useEffect, useState } from "react";
import { storageService } from "../storage";

type SessionContextType = {
  session: UserLogged | null;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserLogged | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    const checkSession = async () => {
      const sessionData = storageService.getSession();
      if (sessionData) {
        setSession(sessionData);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (data: LoginRequest) => {
    const response = await login(data);

    if (!response?.token) {
      throw new Error("Invalid credentials");
    }

    setSession(response);
    storageService.setSession(response);
  };
  const signUp = async (data: RegisterRequest) => {
    const response = await register(data);

    if (!response?.token) {
      throw new Error("Invalid credentials");
    }

    setSession(response);
    storageService.setSession(response);
  };

  const signOut = async () => {
    setSession(null);
    storageService.removeSession();
  };

  return (
    <SessionContext.Provider
      value={{ session, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
