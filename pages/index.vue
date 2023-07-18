<template>
    <section class="min-h-screen grid place-content-center">
      <p>{{ t('pages.index.description') }}</p>
      <p>{{ t('pages.index.title') }}</p>
      <p>{{ $t('welcome') }}</p>
    </section>
</template>

<script setup>
const { t, locale } = useI18n()
const title = computed(() => t('pages.index.title'))
const description = computed(() => t('pages.index.description'))

definePageMeta({
  auth: false,
})

useHead({
  title: title,
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

// const el = ref(null);
// onMounted(() => {
//   window.scrollTo({ top: el, behavior: 'smooth' })
// })
</script>