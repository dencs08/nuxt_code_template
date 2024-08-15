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

const isDark = useDark();

onMounted(() => {
  isDark.value = false;
});
</script>

<template>
  <Body class="bg-gray-50 text-gray-900">
    <main>
      <nav>
        <NuxtLink to="/dashboard">dashboard</NuxtLink>
      </nav>
      <slot />
    </main>
  </Body>
</template>
