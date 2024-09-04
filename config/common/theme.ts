// config/theme.ts
export default {
  colors: {
    primary: "#00ACD4",
    secondary: "#0FB182",
    accent: "#FFEA31",
    surface: "#225486",
    light: "#575757",
    dark: "#E5E5E5",
  },

  borderRadius: {
    none: "0",
    xs: "2px",
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
  },

  fonts: {
    heading: ["Poppins", "Poppins", "sans-serif"],
    body: ["Inter", "Inter", "sans-serif"],
    accent: ["Bebas Neue", "Bebas Neue", "sans-serif"],
    proportions: ["1", "1.618"],
  },

  container: {
    sm: { maxWidth: "100%", padding: "0 2rem" },
    md: { maxWidth: "100%", padding: "0 3rem" },
    lg: { maxWidth: "75vw", padding: "0" },
    xl: { maxWidth: "75vw", padding: "0" },
    "2xl": { maxWidth: "75vw", padding: "0" },
  },
};
