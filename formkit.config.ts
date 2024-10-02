// formkit.config.ts
import type { DefaultConfigOptions } from "@formkit/vue";
import { createAutoAnimatePlugin } from "@formkit/addons";
import { en, pl, de } from "@formkit/i18n";
import { generateClasses } from "@formkit/themes";
import { genesisIcons } from "@formkit/icons";
import myTailwindTheme from "./custom_tailwindcss/formKit";
import { primeInputs, primeOutputs } from "@sfxcode/formkit-primevue";

const config: DefaultConfigOptions = {
  locales: { de, pl, en },
  locale: "en",
  icons: {
    ...genesisIcons,
  },
  config: {
    classes: generateClasses(myTailwindTheme),
  },
  inputs: {
    ...primeInputs,
    ...primeOutputs,
  },
  plugins: [createAutoAnimatePlugin()],
};

export default config;
