<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
const i18nHead = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: {
    canonicalQueries: ['']
  },
})
useHead({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang,
  },
  title: t('layouts.default.title', { title: t(route.meta.title || 'TBD') }),
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])]
})

const isDark = useDark()

onMounted(() => {
  isDark.value = false;
});
</script>

<template>

  <Body class="bg-gray-50 text-gray-900">
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
  </Body>
</template>