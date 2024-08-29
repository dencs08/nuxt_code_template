import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import { generatedColors } from "./generated-colors.js";
const Noir = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: "0",
      xs: "2px",
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
    },
    ...generatedColors,
  },
  semantic: {
    // transitionDuration: "0.05s",
    primary: {
      0: "{my.primary.0}",
      50: "{my.primary.50}",
      100: "{my.primary.100}",
      200: "{my.primary.200}",
      300: "{my.primary.300}",
      400: "{my.primary.400}",
      500: "{my.primary.500}",
      600: "{my.primary.600}",
      700: "{my.primary.700}",
      800: "{my.primary.800}",
      900: "{my.primary.900}",
      950: "{my.primary.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.950}",
          contrastColor: "{surface.0}",
          hoverColor: "{primary.800}",
          activeColor: "{primary.700}",
        },
        highlight: {
          background: "{primary.950}",
          focusBackground: "{primary.700}",
          color: "{surface.0}",
          focusColor: "{surface.0}",
        },
      },
      dark: {
        primary: {
          color: "{primary.50}",
          contrastColor: "{primary.950}",
          hoverColor: "{primary.200}",
          activeColor: "{primary.300}",
        },
        surface: {
          0: "{my.surface.0}",
          50: "{my.surface.50}",
          100: "{my.surface.100}",
          200: "{my.surface.200}",
          300: "{my.surface.300}",
          400: "{my.surface.400}",
          500: "{my.surface.500}",
          600: "{my.surface.600}",
          700: "{my.surface.700}",
          800: "{my.surface.800}",
          900: "{my.surface.900}",
          950: "{my.surface.950}",
        },
        highlight: {
          background: "{primary.50}",
          focusBackground: "{primary.300}",
          color: "{primary.950}",
          focusColor: "{primary.950}",
        },
      },
    },
  },
});

export default {
  preset: Noir,
  options: {
    darkModeSelector: ".dark",
  },
};
