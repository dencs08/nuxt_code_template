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
import { ref, computed, onMounted, onBeforeUnmount, inject } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { type FormKit } from "~~/types/common";

const router = useRouter();
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

const changeLocale = async (newLocale: string) => {
  try {
    isLoading.value = true;
    document.body.style.overflow = "hidden"; // Block scrolling
    await setLocale(newLocale);
    await router.push(switchLocalePath(newLocale));
    selectedLocale.value = newLocale;
    formKit.locale = newLocale;
  } catch (error) {
    console.error("Error changing locale:", error);
  } finally {
    isLoading.value = false;
    document.body.style.overflow = "";
  }
};
</script>
