<template>
  <Body
    class="bg-gray-50 text-surface-800 dark:bg-surface-900 dark:text-surface-0 transition"
  >
    <UserHeader class="absolute bg-transparent" />
    <main>
      <div
        class="bg-surface-800 dark:bg-surface-950 px-10 pt-32 pb-28 transition"
      >
        <h2 class="text-3xl font-bold text-surface-0">{{ displayTitle }}</h2>
      </div>
      <div
        class="bg-white dark:bg-surface-850 min-h-[75vh] border border-surface-500/30 rounded-xl mx-10 mb-8 py-8 px-4 -mt-16 shadow-sm transition"
      >
        <div class="mx-24">
          <slot />
        </div>
      </div>
    </main>
  </Body>
</template>

<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: "id",
  addSeoAttributes: {
    canonicalQueries: [""],
  },
});

const displayTitle = computed(() => {
  return route.meta.displayTitle
    ? t(route.meta.displayTitle as string)
    : t("layouts.default.title");
});

const title = computed(() => t("pages.index.meta.title"));

useHead({
  title: title,
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
});
</script>
