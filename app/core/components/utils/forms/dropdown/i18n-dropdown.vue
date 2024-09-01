<template>
  <Select
    v-model="selectedLocale"
    @update:modelValue="changeLocale"
    :options="availableLocales"
    option-label="label"
    option-value="code"
  >
    <template #value="slotProps">
      <div v-if="slotProps" class="flex items-center">
        <Icon
          :name="`flag:${getFlagCode(slotProps.value)}-4x3`"
          class="mr-2 h-6 w-auto"
        />
        <div>{{ slotProps.value.label }}</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center">
        <Icon
          :name="`flag:${getFlagCode(slotProps.option.code)}-4x3`"
          class="mr-2 h-6 w-auto"
        />
        <div>{{ slotProps.option.label }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { usePrimeVue } from "primevue/config";
import { type FormKit } from "~~/types/common";

const router = useRouter();
const primeVue = usePrimeVue();
const { locales, locale, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath() || (() => "/");
const formKit = inject<FormKit>(Symbol.for("FormKitConfig")) || { locale: "" };
const isLoading = ref(false);
const selectedLocale = ref(locale.value || "");

const languageToFlag: { [key: string]: string } = {
  en: "us",
  de: "de",
  pl: "pl",
};

const getFlagCode = (languageCode: string): string => {
  return (
    languageToFlag[languageCode.toLowerCase()] || languageCode.toLowerCase()
  );
};

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});

const availableLocales = computed(() => {
  return locales.value
    .filter((i) => i.code)
    .map((locale) => ({
      code: locale.code,
      label: locale.name || locale.language || locale.code,
    }));
});

let primeVueLocaleFiles = {} as Record<string, () => Promise<any>>;

onMounted(async () => {
  primeVueLocaleFiles = import.meta.glob(
    "../../../../../../node_modules/primelocale/*.json"
  );
  // console.log(
  //   "Available PrimeVue locale files:",
  //   Object.keys(primeVueLocaleFiles)
  // );
});

watchEffect(() => updatePrimeVueConfigWithLocaleTag(selectedLocale.value));

async function updatePrimeVueConfigWithLocaleTag(localeTag: string) {
  // console.log(
  //   "updatePrimeVueConfigWithLocaleTag called with localeTag:",
  //   localeTag
  // );

  if (!localeTag) {
    // console.log("No localeTag provided, exiting function.");
    return;
  }

  const localeRe = new RegExp(`\\b${localeTag}\\.json$`, "i");
  const langRe = new RegExp(`\\b${localeTag.split("-")[0]}\\.json$`, "i");

  let localeFileName =
    Object.keys(primeVueLocaleFiles).find((locale) => localeRe.test(locale)) ||
    Object.keys(primeVueLocaleFiles).find((locale) => langRe.test(locale));

  if (localeFileName) {
    console.log("localeFileName found:", localeFileName);
    try {
      const localeModule = await primeVueLocaleFiles[localeFileName]();
      // console.log(
      //   "Raw loaded locale module:",
      //   JSON.stringify(localeModule, null, 2)
      // );

      let localeData: Record<string, any>;

      if (localeModule[localeTag]) {
        // If the locale data is nested under the locale tag
        localeData = localeModule[localeTag];
      } else if (Object.keys(localeModule).length === 1) {
        // If the locale data is nested under a single key (e.g., 'de' or 'pl')
        localeData = localeModule[Object.keys(localeModule)[0]];
      } else {
        // If the locale data is directly in the module
        localeData = localeModule;
      }

      // console.log(
      //   "Extracted locale data:",
      //   JSON.stringify(localeData, null, 2)
      // );

      if (localeData && typeof localeData === "object") {
        // Merge the new locale data with the existing config
        primeVue.config.locale = {
          ...primeVue.config.locale,
          ...localeData,
        };
        // console.log(
        //   "Updated primeVue.config.locale:",
        //   JSON.stringify(primeVue.config.locale, null, 2)
        // );
      } else {
        // console.error("Invalid locale data structure:", localeData);
      }
    } catch (error) {
      // console.error("Error loading locale file:", error);
    }
  } else {
    // console.log("No matching locale file found for localeTag:", localeTag);
  }
}

const changeLocale = async (newLocale: string) => {
  try {
    isLoading.value = true;
    document.body.style.overflow = "hidden"; // Block scrolling
    await setLocale(newLocale);
    await router.push(switchLocalePath(newLocale));
    selectedLocale.value = newLocale;
    formKit.locale = newLocale;
    await updatePrimeVueConfigWithLocaleTag(newLocale);
  } catch (error) {
    console.error("Error changing locale:", error);
  } finally {
    isLoading.value = false;
    document.body.style.overflow = "";
  }
};
</script>
