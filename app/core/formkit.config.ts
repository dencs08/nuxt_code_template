// formkit.config.ts
import type { DefaultConfigOptions } from "@formkit/vue";
import { createAutoAnimatePlugin } from "@formkit/addons";
import { en, pl, de } from "@formkit/i18n";

import { primeInputs, primeOutputs } from "@sfxcode/formkit-primevue";
// import { addPrimeAsteriskPlugin } from "@sfxcode/formkit-primevue/plugins";

import { generateClasses } from "@formkit/themes";
import { genesisIcons } from "@formkit/icons";
import myTailwindTheme from "../../custom_tailwindcss/formKit";

const config: DefaultConfigOptions = {
  locales: { de, pl, en },
  locale: "en", //later changed in app.vue onMounted to the user's locale

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
