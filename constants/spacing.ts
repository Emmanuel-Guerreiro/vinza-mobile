/**
 * Design system constants following Tailwind CSS conventions
 * Spacing uses 4px increments (0.25rem)
 * Text sizes use rem units for better accessibility
 */

// Base spacing unit (4px)
const spacingUnit = 4;

// Spacing scale (4px increments)
export const Spacing = {
  // Padding and margin values
  xs: spacingUnit, // 4px
  sm: spacingUnit * 2, // 8px
  md: spacingUnit * 3, // 12px
  lg: spacingUnit * 4, // 16px
  xl: spacingUnit * 6, // 24px
  "2xl": spacingUnit * 8, // 32px
  "3xl": spacingUnit * 12, // 48px
  "4xl": spacingUnit * 16, // 64px
  "5xl": spacingUnit * 20, // 80px
  "6xl": spacingUnit * 24, // 96px

  // Additional common values
  "0": 0,
  "0.5": spacingUnit * 0.5, // 2px
  "1": spacingUnit, // 4px
  "1.5": spacingUnit * 1.5, // 6px
  "2": spacingUnit * 2, // 8px
  "2.5": spacingUnit * 2.5, // 10px
  "3": spacingUnit * 3, // 12px
  "3.5": spacingUnit * 3.5, // 14px
  "4": spacingUnit * 4, // 16px
  "5": spacingUnit * 5, // 20px
  "6": spacingUnit * 6, // 24px
  "7": spacingUnit * 7, // 28px
  "8": spacingUnit * 8, // 32px
  "9": spacingUnit * 9, // 36px
  "10": spacingUnit * 10, // 40px
  "11": spacingUnit * 11, // 44px
  "12": spacingUnit * 12, // 48px
  "14": spacingUnit * 14, // 56px
  "16": spacingUnit * 16, // 64px
  "20": spacingUnit * 20, // 80px
  "24": spacingUnit * 24, // 96px
  "28": spacingUnit * 28, // 112px
  "32": spacingUnit * 32, // 128px
  "36": spacingUnit * 36, // 144px
  "40": spacingUnit * 40, // 160px
  "44": spacingUnit * 44, // 176px
  "48": spacingUnit * 48, // 192px
  "52": spacingUnit * 52, // 208px
  "56": spacingUnit * 56, // 224px
  "60": spacingUnit * 60, // 240px
  "64": spacingUnit * 64, // 256px
  "72": spacingUnit * 72, // 288px
  "80": spacingUnit * 80, // 320px
  "96": spacingUnit * 96, // 384px
} as const;

// Border radius values
export const BorderRadius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  "2xl": 12,
  "3xl": 16,
  full: 9999, // For circular elements
} as const;

// Text sizes in rem (for better accessibility)
export const TextSizes = {
  xs: 12, // 0.75rem
  sm: 14, // 0.875rem
  md: 16, // 1rem
  lg: 18, // 1.125rem
  xl: 20, // 1.25rem
  "2xl": 24, // 1.5rem
  "3xl": 30, // 1.875rem
  "4xl": 36, // 2.25rem
  "5xl": 48, // 3rem
  "6xl": 60, // 3.75rem
  "7xl": 72, // 4.5rem
  "8xl": 96, // 6rem
  "9xl": 128, // 8rem
} as const;

// Line heights for text
export const LineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Font weights
export const FontWeights = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

// Shadows (for React Native)
export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 8,
  },
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 12,
  },
} as const;

// Z-index values
export const ZIndex = {
  "0": 0,
  "10": 10,
  "20": 20,
  "30": 30,
  "40": 40,
  "50": 50,
  auto: "auto",
} as const;

// Export all design tokens together
export const DesignTokens = {
  spacing: Spacing,
  borderRadius: BorderRadius,
  textSizes: TextSizes,
  lineHeights: LineHeights,
  fontWeights: FontWeights,
  shadows: Shadows,
  zIndex: ZIndex,
} as const;
