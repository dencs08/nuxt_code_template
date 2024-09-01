// utils/initializeApp.ts

import { useI18n } from "vue-i18n";
import { usePrimeVue } from "primevue/config";
import { type FormKit } from "~~/types/common";
import kswitchConfig from "~~/config/common/kswitch";

export const initializeApp = async () => {
  const { locale } = useI18n();
  const primeVue = usePrimeVue();
  const formKit = inject<FormKit>(Symbol.for("FormKitConfig")) || {
    locale: "",
  };

  // Set FormKit locale
  formKit.locale = locale.value;

  // Set PrimeVue locale
  const updatePrimeVueLocale = async (localeCode: string) => {
    try {
      // Adjust the path as needed based on your project structure
      const module = await import(
        `../../../node_modules/primelocale/${localeCode}.json`
      );
      primeVue.config.locale = module[localeCode] || module;
    } catch (error) {
      console.error(`Failed to load PrimeVue locale for ${localeCode}:`, error);
      // Fallback to English locale
      const enModule = await import("primelocale/en.json");
      primeVue.config.locale = enModule["en"] || enModule;
    }
  };

  await updatePrimeVueLocale(locale.value);

  // Check KSwitch
  const checkKSwitch = async () => {
    try {
      const kswitchUrl = kswitchConfig.KSWITCH_URL;
      const response = await fetch(kswitchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.k || false;
    } catch (error) {
      console.error("Error checking KSwitch:", error);
      return false;
    }
  };

  const isKSwitchActive = await checkKSwitch();

  return { isKSwitchActive };
};
