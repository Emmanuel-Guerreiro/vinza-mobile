/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#5B1E34";
const tintColorDark = "#5B1E34";

export const Colors = {
  light: {
    primary: tintColorLight,
    text: {
      primary: "#000000",
      secondary: "#687076",
    },
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    gray: {
      primary: "#DBDBDB",
      secondary: "#F2F2F2",
    },
    white: "#fff",
  },
  dark: {
    primary: tintColorDark,
    text: {
      primary: "#ECEDEE",
      secondary: "#9BA1A6",
    },
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    gray: {
      primary: "#DBDBDB",
      secondary: "#F2F2F2",
    },
    white: "#fff",
  },
};
