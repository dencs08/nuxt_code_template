// formkit.config.ts
import type { DefaultConfigOptions } from "@formkit/vue";
import { createAutoAnimatePlugin } from "@formkit/addons";

// import { primeInputs } from "@sfxcode/formkit-primevue";
import { primeInputs } from "@/assets/formkit-primevue-2.3.2/src";

import { en, pl, de } from "@formkit/i18n";

import { generateClasses } from "@formkit/themes";
import { genesisIcons } from "@formkit/icons";
import myTailwindTheme from "./custom_tailwindcss/formKit";

const config: DefaultConfigOptions = {
  plugins: [createAutoAnimatePlugin()],

  icons: {
    ...genesisIcons,
  },
  config: {
    classes: generateClasses(myTailwindTheme),
  },

  inputs: {
    ...primeInputs,
    // ...appInputs,
  },
  locales: { de, pl, en },
};

export default config;
