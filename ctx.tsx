import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

type Session = {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
};

type SessionContextType = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | null>(null);

// Simple storage utility
const storage = {
  getItem: (key: string): string | null => {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error("Local storage is unavailable:", e);
        return null;
      }
    }
    // For native platforms, you'd use AsyncStorage or similar
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    }
    // For native platforms, you'd use AsyncStorage or similar
  },
  removeItem: (key: string): void => {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error("Local storage is unavailable:", e);
      }
    }
    // For native platforms, you'd use AsyncStorage or similar
  },
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    const checkSession = async () => {
      try {
        const sessionData = storage.getItem("session");
        if (sessionData) {
          const parsedSession = JSON.parse(sessionData);
          setSession(parsedSession);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - replace with your actual auth logic
    const mockSession: Session = {
      user: {
        id: "1",
        email,
        name: email.split("@")[0], // Use email prefix as name for demo
      },
    };

    setSession(mockSession);
    storage.setItem("session", JSON.stringify(mockSession));
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock registration - replace with your actual auth logic
    const mockSession: Session = {
      user: {
        id: "1",
        email,
        name,
      },
    };

    setSession(mockSession);
    storage.setItem("session", JSON.stringify(mockSession));
  };

  const signOut = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSession(null);
    storage.removeItem("session");
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
