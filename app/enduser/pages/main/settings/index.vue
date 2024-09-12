<template>
  <div>
    <h4>General</h4>
    <p class="mt-1.5">Main app settings</p>
    <div
      class="mt-8 divide-y divide-surface-200/40 dark:divide-surface-700/65 [&>*]:py-4"
    >
      <div v-for="setting in settings" :key="setting.name">
        <div class="flex justify-between items-center">
          <p
            class="font-heading font-medium text-surface-500 dark:text-surface-200"
          >
            {{ setting.name }}
          </p>
          <component :is="setting.component" v-bind="setting.componentProps" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ColorModeSelector from "@/core/components/utils/color-mode-selector.vue";
import LanguageSelector from "@/core/components/utils/forms/dropdown/i18n-dropdown.vue";

definePageMeta({
  layout: "main",
});

const settings = shallowRef([
  {
    name: "Dark mode",
    component: ColorModeSelector,
    componentProps: {
      type: "switch",
    },
  },
  {
    name: "Language",
    component: LanguageSelector,
  },
]);
</script>
