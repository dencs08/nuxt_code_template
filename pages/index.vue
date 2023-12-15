<template>
  <div>
    <section class="container mx-auto min-h-screen grid place-content-center text-center">
      <h1 v-motion="slideTop({delay: 400})">
        {{ t('pages.index.title') }}
      </h1>
      <p class="font-body text-3xl font-bold" v-motion="fade({delay: 425})">
        {{ t('pages.index.description') }}
      </p>
      <p class="font-accent text-2xl font-black" v-motion="slideBottom({delay: 450})">
        {{ $t('welcome') }}
      </p>
    </section>
    <section>
      Need to have for class registration of tailwind
      <p class="hover:shadow-sm hover:bg-blue-700">a</p>
    </section>
  </div>
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

const { slideTop, slideLeft, slideRight,fade, slideBottom} = useAnimations();
</script>