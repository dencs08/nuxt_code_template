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
      files: [
        "pl.json",
        "./pl/utilities.json",
        "./pl/index.json",
        "./pl/contact.json",
        "./pl/main.json",
        "./pl/account.json",
      ],
      language: "pl-PL",
    },
    {
      code: "en",
      files: [
        "en.json",
        "./en/utilities.json",
        "./en/index.json",
        "./en/contact.json",
        "./en/main.json",
        "./en/account.json",
      ],
      language: "en-US",
    },
    {
      code: "de",
      files: [
        "de.json",
        "./de/utilities.json",
        "./de/index.json",
        "./de/contact.json",
        "./de/main.json",
        "./de/account.json",
      ],
      language: "de-DE",
    },
  ],
  lazy: true,
  defaultLocale: "en",
  langDir: "locales",
  baseUrl: process.env.BASE_URL || "url not set in the i18n module or env file",
};
