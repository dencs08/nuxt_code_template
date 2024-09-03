/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
import { generateColorVariants } from "./custom_tailwindcss/colors";
import generateFontSizeVariants from "./custom_tailwindcss/fontSizes";

//!!!DEFINE COLORS, FONT SIZES, FONT FAMILY VARIANTS, BREAKPOINTS HERE:
const colorDefinitions = [
  { colorName: "primary", mainHex: "#00ACD4" }, //color also used in the primeVue components
  { colorName: "secondary", mainHex: "#0FB182" },
  { colorName: "accent", mainHex: "#FFEA31" },
  { colorName: "surface", mainHex: "#225486" }, //color also used in the primeVue components best if based on primary or secondary
  { colorName: "dark", mainHex: "#575757" },
  { colorName: "light", mainHex: "#E5E5E5" },
];
const fontFamilyVariants = {
  heading: ["Poppins", "Poppins", "sans-serif"],
  body: ["Inter", "Inter", "sans-serif"],
  accent: ["Bebas Neue", "Bebas Neue", "sans-serif"],
};
const screenSizes = {
  xs: "350px",
  ...defaultTheme.screens,
};

const colorVariants = generateColorVariants(colorDefinitions);
const fontSizeVariants = generateFontSizeVariants(1, 1.618); //scale the font with the golden ratio

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
    },
  },
  plugins: [
    function ({ addComponents }: { addComponents: Function }) {
      addComponents({
        ".container": {
          maxWidth: "100%",
          padding: "0 1rem 0 1rem",
          "@screen sm": {
            maxWidth: "100%",
            padding: "0 2rem 0 2rem",
          },
          "@screen md": {
            maxWidth: "100%",
            padding: "0 3rem 0 3rem",
          },
          "@screen lg": {
            maxWidth: "75vw",
            padding: "0",
          },
          "@screen xl": {
            maxWidth: "75vw",
            padding: "0",
          },
          "@screen 2xl": {
            maxWidth: "75vw",
            padding: "0",
          },
        },
      });
    },
  ],
};
