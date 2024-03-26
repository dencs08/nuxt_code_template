// config/fonts.ts - nuxt-fonts module

//most of the fonts gets resolved automatically by the module check nuxt-fonts documentation for more info
export default {
    experimental: { addPreloadLinks: true },
    // providers: {
    //   custom: '~/providers/custom'
    // },
    // families: [
        // { name: 'Custom Font', provider: 'none' }, //do not resolve this font with any provider from `@nuxt/fonts`
        // { name: 'My Font Family', provider: 'google' }, //only provide this font with the google provider
    // ],
    defaults: {
      fallbacks: {
        'serif': ['Times New Roman'],
        'sans-serif': ['Arial'],
        'monospace': ['Courier New'],
      }
    }
};