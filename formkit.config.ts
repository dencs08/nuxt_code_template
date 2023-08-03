// formkit.config.ts
import type { DefaultConfigOptions } from '@formkit/vue'
import { primeInputs } from '@sfxcode/formkit-primevue'
import { en,pl,de } from '@formkit/i18n'

import { generateClasses } from '@formkit/themes'
import { genesisIcons } from '@formkit/icons'
import myTailwindTheme from './custom_tailwindcss/formKit'

const config: DefaultConfigOptions = {
    icons: {
        ...genesisIcons,
    },
    config: {
        classes: generateClasses(myTailwindTheme),
    },

    inputs: primeInputs,
    locales: { de, pl, en },
}

export default config