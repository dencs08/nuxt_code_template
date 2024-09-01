// config/i18n.ts

export default {
  vueI18n: "../../../i18n.config.ts",
  strategy: "prefix_except_default",
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    redirectOn: "root",
    alwaysRedirect: true,
  },
  locales: [
    {
      code: "pl",
      file: "pl.json",
      language: "pl-PL",
    },
    {
      code: "en",
      file: "en.json",
      language: "en-US",
    },
    {
      code: "de",
      file: "de.json",
      language: "de-DE",
    },
  ],
  lazy: true,
  defaultLocale: "en",
  langDir: "locales",
  baseUrl: process.env.BASE_URL || "url not set in the i18n module or env file",
};
