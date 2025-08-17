import { Href } from "expo-router";

// Navigation and route constants for the app
export const ROUTES: Record<string, Href> = {
  DEFAULT: "/auth?mode=login",
  AUTH: "/auth",
  REGISTER: "/auth?mode=register",
  LOGIN: "/auth?mode=login",
  VALIDATE: "/validate",
  HOME: "/(app)/(tabs)/home",
  APP_TABS: "/(app)/(tabs)/home",
  COMPLETE_PROFILE: "/complete-profile",
} as const;
