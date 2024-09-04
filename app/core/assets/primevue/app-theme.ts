import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import { generatedColors } from "./generated-colors";
import theme from "../../../../config/common/theme";
const Noir = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: theme.borderRadius.none,
      xs: theme.borderRadius.xs,
      sm: theme.borderRadius.sm,
      md: theme.borderRadius.md,
      lg: theme.borderRadius.lg,
      xl: theme.borderRadius.xl,
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

  components: {
    card: {
      colorScheme: {
        light: {
          root: {
            background: "{surface.0}",
            color: "{surface.700}",
            borderRadius: "12px",
          },
        },
        dark: {
          root: {
            background: "{surface.950}",
            color: "{surface.0}",
            borderRadius: "12px",
          },
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
