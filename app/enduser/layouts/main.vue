<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: {
    canonicalQueries: [""],
  },
});

const title = computed(() => {
  const titleKey =
    typeof route.meta.title === "string" || typeof route.meta.title === "number"
      ? route.meta.title
      : "TBD";
  return t("layouts.default.title", { title: t(titleKey) });
});

useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
  },
  title: title,
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
});

const { hasPermission } = usePermissions();
const hasDashboardReadPermission = computed(() =>
  hasPermission("dashboard", "read")
);
</script>

<template>
  <Body
    class="bg-gray-50 text-gray-800 dark:bg-surface-900 dark:text-surface-0 transition"
  >
    <main>
      <nav class="flex flex-row items-center justify-start h-10 w-full p-3">
        <template v-if="hasDashboardReadPermission">
          <NuxtLink :to="localePath('/dashboard')">
            <Icon name="ic:outline-dashboard" class="h-6 w-6" />
          </NuxtLink>
        </template>
        <ColorModeSelector />
      </nav>
      <slot />
    </main>
  </Body>
</template>
