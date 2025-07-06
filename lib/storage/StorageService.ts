import { STORAGE_KEYS, StorageKey } from "@/constants/StorageKeys";
import { UserLogged } from "@/modules/auth/types";
import { Platform } from "react-native";

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public getItem(key: StorageKey): string | null {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    // For native platforms, you'd use AsyncStorage or similar
    return null;
  }

  public setItem(key: StorageKey, value: string): void {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    }
    // For native platforms, you'd use AsyncStorage or similar
  }

  public removeItem(key: StorageKey): void {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    }
    // For native platforms, you'd use AsyncStorage or similar
  }

  public clear(): void {
    if (Platform.OS === "web") {
      localStorage.clear();
    }
    // For native platforms, you'd use AsyncStorage or similar
  }

  // Convenience methods for common operations
  public getSession(): UserLogged | null {
    const sessionData = this.getItem(STORAGE_KEYS.SESSION);
    if (sessionData) {
      return JSON.parse(sessionData) as UserLogged;
    }
    return null;
  }

  public setSession(session: UserLogged): void {
    this.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }

  public removeSession(): void {
    this.removeItem(STORAGE_KEYS.SESSION);
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();
