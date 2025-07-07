import { Href } from "expo-router";

// Navigation and route constants for the app
export const ROUTES: Record<string, Href> = {
  DEFAULT: "/auth?mode=login",
  AUTH: "/auth",
  REGISTER: "/auth?mode=register",
  LOGIN: "/auth?mode=login",
  VALIDATE: "/validate",
  EXPLORE: "/(app)/(tabs)/explore",
  APP_TABS: "/(app)/(tabs)",
  COMPLETE_PROFILE: "/complete-profile",
} as const;
