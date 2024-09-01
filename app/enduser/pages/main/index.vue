<script setup lang="ts">
definePageMeta({
  layout: "main",
});

const { t, locale } = useI18n();
const title = computed(() => t("pages.index.title"));
const description = computed(() => t("pages.index.description"));

useHead({
  title: title,
  meta: [
    { property: "description", content: description },
    { property: "og:description", content: description },
    { property: "og:title", content: title },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: locale },
    // { property: 'og:url', content: 'https://nuxt.com' },
    // { property: 'og:image', content: 'https://nuxt.com/social.jpg' },
  ],
});
</script>

<template>
  <div class="grid place-content-center h-screen">
    <h1>Main!</h1>
  </div>
</template>
