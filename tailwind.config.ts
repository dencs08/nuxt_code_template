/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
import { generateColorVariants } from "./custom_tailwindcss/colors";
import generateFontSizeVariants from "./custom_tailwindcss/fontSizes";
import theme from "./config/common/theme";

const colorDefinitions = Object.entries(theme.colors).map(
  ([colorName, mainHex]) => ({
    colorName,
    mainHex,
  })
);

const fontFamilyVariants = theme.fonts;
const colorVariants = generateColorVariants(colorDefinitions);
const fontSizeVariants = generateFontSizeVariants(
  ...theme.fonts.proportions.map(Number)
);
const screenSizes = {
  xs: "350px",
  ...defaultTheme.screens,
};

module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./containers/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./assets/primevue/**/*.{js,vue,ts}",
  ],
  corePlugins: {
    // ...
    container: false,
  },
  theme: {
    screens: screenSizes,
    extend: {
      colors: colorVariants,
      fontSize: fontSizeVariants,
      fontFamily: fontFamilyVariants,
      borderRadius: theme.borderRadius,
    },
  },
  plugins: [
    function ({ addComponents }: any) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          padding: "0 1rem",
          "@screen sm": theme.container.sm,
          "@screen md": theme.container.md,
          "@screen lg": theme.container.lg,
          "@screen xl": theme.container.xl,
          "@screen 2xl": theme.container["2xl"],
        },
      });
    },
  ],
};
