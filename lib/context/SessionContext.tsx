import {
  login,
  register,
  validateAccount as validate,
} from "@/modules/auth/api";
import {
  LoginRequest,
  RegisterRequest,
  UserLogged,
  ValidateAccountRequest,
} from "@/modules/auth/types";
import { UpdateUser } from "@/modules/user/types";
import { createContext, useContext, useEffect, useState } from "react";
import { storageService } from "../storage";

type SessionContextType = {
  session: UserLogged | null;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<UserLogged>;
  signUp: (data: RegisterRequest) => Promise<UserLogged>;
  signOut: () => Promise<void>;
  validateAccount: (data: ValidateAccountRequest) => Promise<UserLogged>;
  updateSessionUserData: (data: UpdateUser) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserLogged | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    const checkSession = async () => {
      const sessionData = await storageService.getSession();
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

    persistSession(response);
    return response;
  };

  const signUp = async (data: RegisterRequest) => {
    const response = await register(data);

    if (!response?.token) {
      throw new Error("Invalid credentials");
    }

    persistSession(response);
    return response;
  };

  const validateAccount = async (data: ValidateAccountRequest) => {
    const response = await validate(data);
    persistSession(response);
    return response;
  };

  const persistSession = (session: UserLogged) => {
    setSession(session);
    storageService.setSession(session);
  };

  const signOut = async () => {
    setSession(null);
    storageService.removeSession();
  };

  const updateSessionUserData = (data: UpdateUser) => {
    setSession({ ...session, ...data } as UserLogged);
    storageService.setSession({ ...session, ...data } as UserLogged);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        validateAccount,
        updateSessionUserData,
      }}
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
