// Storage keys used throughout the application
export const STORAGE_KEYS = {
  SESSION: "session",
  AUTH_TOKEN: "auth_token",
} as const;

// Type for storage keys
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
