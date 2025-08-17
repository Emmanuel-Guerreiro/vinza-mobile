import { STORAGE_KEYS, StorageKey } from "@/constants/storage-keys";
import { UserLogged } from "@/modules/auth/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async getItem(key: StorageKey): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  public async setItem(key: StorageKey, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  public async removeItem(key: StorageKey): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  public async clear(): Promise<void> {
    await AsyncStorage.clear();
  }

  // Convenience methods for common operations
  public async getSession(): Promise<UserLogged | null> {
    const sessionData = await this.getItem(STORAGE_KEYS.SESSION);
    if (sessionData) {
      return JSON.parse(sessionData) as UserLogged;
    }
    return null;
  }

  public async setSession(session: UserLogged): Promise<void> {
    await this.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }

  public async removeSession(): Promise<void> {
    await this.removeItem(STORAGE_KEYS.SESSION);
  }
}

// Export singleton instance
export const storageService = StorageService.getInstance();
