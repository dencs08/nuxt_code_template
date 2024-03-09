<script setup lang="ts">
const { t, locale } = useI18n()
const business = useBusiness()
const route = useRoute()

const title = computed(() => t('pages.index.meta.title'))
const description = computed(() => t('pages.index.meta.description'))

const url = business.url.value + route.fullPath;

useHead({
  title: title,
  link: [{ rel: 'canonical', href: url }],
  meta: [
    { property: 'description', content: description },
    { property: 'og:description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: locale },
    // { property: 'og:url', content: 'https://nuxt.com' },
    // { property: 'og:image', content: 'https://nuxt.com/social.jpg' },
  ]
})
</script>

<template>
  <div class="grid place-content-center h-screen">
    <h1>Contact</h1>
  </div>
</template>