<script setup lang="ts">
const { t, locale } = useI18n();
const title = computed(() => t("index.title"));
const description = computed(() => t("index.description"));
const localePath = useLocalePath();
const userStore = useUserStore();
const user = userStore.getUser;

definePageMeta({
  layout: "main",
  displayTitle: "Home",
});

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
  <div>
    <div class="grid place-content-center text-center">
      <h3 class="text-lg">Hi, {{ user.email }}</h3>
    </div>

    <section>
      <PrimevueThemer />
    </section>
  </div>
</template>
